import { BrowserRouter } from 'react-router-dom';
import './App.css';
import NavBar from './components/comp/NavBar';
import { CallBox, callView, getScreen } from './service/abi_to_component';
import { useEffect, useState } from 'react';

import { useWallet } from './contexts/WalletContext';

import ViewParams from './components/comp/ViewParams';

import ContractSelector from './components/comp/ContractSelector';
import { CONTRACTS_SELECT } from './configs/contracts';

function App() {
    const [contract, setContract] = useState(CONTRACTS_SELECT['CrvUSD-USDC Market']);

    const [viewFunctions, setViewFunctions] = useState<{
        [functionName: string]: CallBox;
    }>({});
    const [writeFunctions, setWriteFunctions] = useState<{
        [functionName: string]: CallBox;
    }>({});

    const { signer } = useWallet();

    useEffect(() => {
        if (signer) {
            getScreen(signer!, contract).then((res) => {
                setViewFunctions(res.viewState);
                // setWriteFunctions(res.stateViewWithParams);
            });
        }
    }, [signer]);

    function setViewInput(functionName: string, paramName: string, value: string) {
        setViewFunctions({
            ...viewFunctions,
            [functionName]: { ...viewFunctions[functionName], params: { ...viewFunctions[functionName].params, [paramName]: value } },
        });
    }

    function ww(functionName: string) {
        callView(functionName, viewFunctions[functionName]).then((res) => {
            setViewFunctions({ ...viewFunctions, [functionName]: { ...viewFunctions[functionName], result: res } });
        });
    }

    // function setWriteInput(functionName: string, paramName: string, value: string) {
    //     setWriteFunctions({
    //         ...stateActionsCall,
    //         [functionName]: { ...stateActionsCall[functionName], params: { ...stateActionsCall[functionName].params, [paramName]: value } },
    //     });
    // }

    // function callWrite(functionName: string) {
    //     callAction(functionName, stateActionsCall[functionName], signer!).then((res) => {
    //         setWriteFunctions({
    //             ...stateActionsCall,
    //             [functionName]: { ...stateActionsCall[functionName], result: res.value.toString(), isSuccess: res.success },
    //         });
    //     });
    // }

    function switchScreen(contractName: keyof typeof CONTRACTS_SELECT) {
        setContract(CONTRACTS_SELECT[contractName]);
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className="App mx-8">
                <BrowserRouter></BrowserRouter>
                <ContractSelector switchScreen={switchScreen} className="my-3" />
                <ViewParams boxs={viewFunctions} callContract={ww} updateField={setViewInput} className="my-5" />
                {/* <Actions boxs={stateActionsCall} updateField={setInputWriteParams} callContract={callActions} className="my-5" /> */}
            </div>
        </div>
    );
}

export default App;
