import { FunctionFragment, JsonRpcProvider, Interface, BytesLike, formatEther } from 'ethers';

import * as multicallAbi from '../abi/multicall.json';
import * as MarketNoRewards from '../abi/tgUSD/MarketNoRewards.json';

import { AbiCoder } from 'ethers';
import { Signer } from 'ethers';
import { CONTRACTS_SELECT } from '../configs/contracts';
import { ABI_CONFIG } from '../configs/abiConfig';
import { Contract } from 'ethers';

export type CallBox = {
    result?: string;
    params?: { [key: string]: bigint | string | boolean };
    isSuccess?: boolean;
};

export type FunctionsSorted = {
    viewWithoutParams: FunctionFragment[];
    viewWithParams: FunctionFragment[];
    actionFunctions: FunctionFragment[];
};

export type Contract = {
    addres: string;
    abiName: string;
};

export type KeyOfAbiConfig = keyof typeof ABI_CONFIG;
export type KeyOfContracts = keyof typeof CONTRACTS_SELECT;

const contract = '0xf94ab55a20b32ac37c3a105f12db535986697945';
const provider = new JsonRpcProvider('http://localhost:8545');

export async function getScreen(signer: Signer, contract: Contract) {
    const abiName = contract.abiName as unknown as KeyOfAbiConfig;
    const abi = (await import('../abi/tgUSD/' + abiName + '.json')).abi as unknown as FunctionFragment[];
    const abiSorted = sortFunctions(abi, configureFilter([]), false);
    const viewState = await getViewStateAndValues(signer, abiName, abiSorted.viewFunctions);
    return { viewState };
}
export function configureFilter(functionName: string[]): Map<string, boolean> {
    const filter: Map<string, boolean> = new Map();
    functionName.forEach((name) => {
        filter.set(name, true);
    });

    return filter;
}

export function sortFunctions(abi: Array<FunctionFragment>, filter: Map<string, boolean>, filterToggle: boolean) {
    const viewFunctions: FunctionFragment[] = [];
    const writeFunctions: FunctionFragment[] = [];
    abi.filter((item) => item.type === 'function').forEach((item) => {
        if ((filterToggle && filter.get(item.name) === true) || (!filterToggle && (filter.get(item.name) === false || filter.get(item.name) === undefined))) {
            if (item.stateMutability === 'view' || item.stateMutability === 'pure') {
                viewFunctions.push(item);
            } else {
                writeFunctions.push(item);
            }
        }
    });

    return { viewFunctions, writeFunctions };
}

export async function getViewStateAndValues(signer: Signer, abiName: KeyOfAbiConfig, viewFunctions: FunctionFragment[]) {
    const calls: any[] = [];

    const viewState: { [functionName: string]: CallBox } = {};

    const functionCalledInMulticall: FunctionFragment[] = [];

    for (let i = 0; i < viewFunctions.length; i++) {
        const viewFunc = viewFunctions[i];
        const functionName = viewFunc.name;
        if (viewFunc.inputs.length === 0) {
            calls.push({ target: contract, allowFailure: false, callData: new Interface(viewFunctions).encodeFunctionData(functionName, []) });
            functionCalledInMulticall.push(viewFunc);
        } else {
            const config: any = ABI_CONFIG[abiName]['view'][functionName];

            viewFunc.inputs.forEach((input) => {
                viewState![functionName]!.params![input.name ? input.name : input.type] = '';
            });

            let defaultParams: any[] = config?.defaultParams;
            if (defaultParams) {
                for (let k = 0; k < defaultParams.length; k++) {
                    if (defaultParams[k] === 'msg.sender') {
                        defaultParams[k] = await signer.getAddress();
                    }
                }

                console.log(defaultParams, functionName);

                calls.push({
                    target: contract,
                    allowFailure: true,
                    callData: new Interface(viewFunctions).encodeFunctionData(functionName, defaultParams),
                });
                functionCalledInMulticall.push(viewFunc);
            }
        }
        viewState[functionName] = {
            result: '',
        };
    }

    const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
    const multicallContract = new Contract(MULTICALL_ADDRESS, multicallAbi.abi, provider);
    // console.log(calls);
    const result = await multicallContract.aggregate3(calls);
    result.forEach((callResult: { success: any; returnData: BytesLike }, index: number) => {
        if (callResult.success) {
            const funcName = functionCalledInMulticall[index].name;

            console.log(funcName);
            const decodedData = AbiCoder.defaultAbiCoder().decode(
                [functionCalledInMulticall[index].outputs[0].type], // Type attendu de la sortie
                callResult.returnData
            );
            let formattedData: string = decodedData[0].toString();

            const config = ABI_CONFIG[abiName]['view'][funcName];
            if (config?.format === 'formatEther') {
                formattedData = formatEther(formattedData);
            }
            viewState[functionCalledInMulticall[index].name].result = formattedData;
        } else {
            console.log(`Call ${index} failed.`);
        }
    });
    return viewState;
}

function getState_ViewParams_Actions(viewWithParams: FunctionFragment[], actionFunctions: FunctionFragment[]) {
    const stateViewWithParams: { [functionName: string]: CallBox } = {};
    const stateActions: { [functionName: string]: CallBox } = {};

    viewWithParams.forEach((func) => {
        const params: { [key: string]: bigint | string | boolean } = {};
        func.inputs.forEach((input) => {
            params[input.name ? input.name : input.type] = '';
        });
        stateViewWithParams[func.name] = {
            params,
            result: '',
        };
    });

    actionFunctions.forEach((func) => {
        const params: { [key: string]: bigint | string | boolean } = {};
        func.inputs.forEach((input) => {
            params[input.name ? input.name : input.type] = '';
        });
        stateActions[func.name] = {
            params,
        };
    });

    return { stateViewWithParams, stateActions };
}

export async function callView(functionName: string, box: CallBox) {
    const contractCall = new Contract(contract, MarketNoRewards.abi, provider);
    const params: unknown[] = [];
    Object.values(box.params!).forEach((a) => {
        params.push(a);
    });
    const config = FormatterConfig['MarketNoRewards']['viewParams'][functionName];

    let formattedData = (await contractCall[functionName](...params)).toString();

    if (config?.format === 'formatEther') {
        formattedData = formatEther(formattedData);
    }

    return formattedData;
}

export async function callAction(functionName: string, box: CallBox, signer: Signer) {
    const contractCall = new Contract(contract, MarketNoRewards.abi, signer);
    const params: unknown[] = [];
    Object.values(box.params!).forEach((a) => {
        params.push(a);
    });
    let ress: { success: boolean; value: any } = {};
    await contractCall[functionName](...params)
        .then((res) => {
            ress = { success: true, value: res };
        })
        .catch((e) => {
            ress = { success: false, value: errorHandling(e) };
        });

    return ress;
}

function errorHandling(e: Error) {
    const iface = new Interface(MarketNoRewards.abi);
    const decodedError = iface.parseError(e!.data);
    return decodedError!.name;
}
