import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CallBox } from '../../service/abi_to_component';

type Props = {
    boxs: { [functionName: string]: CallBox };
    className: string;
};

export default function ViewNoParams(params: Props) {
    return (
        <div className={params?.className}>
            <h1 className="text-4xl font-bold mb-2">Without params</h1>
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
                                    <p>{callBox.result}</p>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
