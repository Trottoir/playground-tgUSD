import { Button } from '@/components/ui/button';

export default function NavBar() {
    return (
        <nav className="border-b bg-card px-2 py-4">
            <div className="flex items-center justify-between">
                <span className=" text-4xl font-semibold">Playground</span>
                <div className="flex ">
                    <Button variant="outline">Market no rewards</Button>
                    <Button variant="outline">Market LP Convex</Button>
                    <Button variant="outline">LP Manip</Button>
                </div>
            </div>
        </nav>
    );
}
