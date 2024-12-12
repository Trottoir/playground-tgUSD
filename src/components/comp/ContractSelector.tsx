import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { CONTRACTS_SELECT } from '../../configs/contracts';

type Props = {
    switchScreen: (value: keyof typeof CONTRACTS_SELECT) => void;
    className: string;
};

export default function ContractSelector(props: Props) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<keyof typeof CONTRACTS_SELECT>('CrvUSD-USDC Market');

    return (
        <div className="mt-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                        {value ? value : 'Select Contract'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {Object.entries(CONTRACTS_SELECT).map(([name, data]) => (
                                    <CommandItem
                                        key={name}
                                        value={name}
                                        onSelect={(currentValue: string) => {
                                            setValue(currentValue as keyof typeof CONTRACTS_SELECT);
                                            setOpen(false);
                                            props.switchScreen(currentValue as keyof typeof CONTRACTS_SELECT);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', value === name ? 'opacity-100' : 'opacity-0')} />
                                        {name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
