import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { CallBox } from '../../service/abi_to_component';
import { Button } from '../ui/button';

export type Props = {
    boxs: { [functionName: string]: CallBox };
    updateField: (funcionName: string, paramName: string, value: string) => void;
    callContract: (functionName: string) => void;
    className: string;
};
export default function Actions(params: Props) {
    return (
        <div className={params?.className}>
            <h1 className="text-4xl font-bold mb-2">Actions</h1>
            <div className="grid grid-cols-5 gap-3">
                {!params.boxs ? (
                    <></>
                ) : (
                    Object.entries(params.boxs).map(([functionName, callBox]) => {
                        return (
                            <Card key={functionName}>
                                <CardHeader>
                                    <CardTitle>{functionName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Object.entries(callBox.params!).map(([paramName, value]) => {
                                        return (
                                            <div key={paramName} className="grid w-full items-center gap-1.5">
                                                <Label htmlFor={paramName}>{paramName}</Label>
                                                <Input
                                                    id={paramName}
                                                    className="w-full"
                                                    placeholder={paramName}
                                                    value={value.toString()}
                                                    onChange={(e) => params.updateField(functionName, paramName, e.target.value)}
                                                />
                                            </div>
                                        );
                                    })}
                                    <div className="flex justify-between items-center mt-3">
                                        <p className={callBox.isSuccess ? '' : 'text-red-500'}>{callBox.isSuccess ? 'Success!' : callBox.result}</p>
                                        <Button onClick={() => params.callContract(functionName)}>Call</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
