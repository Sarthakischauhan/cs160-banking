"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterProps = {
    onFilter: (filters: any) => void;
};

export default function ReportFilters({ onFilter }: FilterProps) {
    const [customerId, setCustomerId] = useState("");
    const [accountType, setAccountType] = useState("");
    const [minBalance, setMinBalance] = useState("");
    const [maxBalance, setMaxBalance] = useState("");

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6 border-b pb-4">
            <div>
                <label className="text-sm text-gray-600">Customer ID</label>
                <Input
                    placeholder="e.g. 123"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-48"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Account Type</label>
                <Select onValueChange={(v) => setAccountType(v)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="text-sm text-gray-600">Balance Range</label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Min"
                        type="number"
                        value={minBalance}
                        onChange={(e) => setMinBalance(e.target.value)}
                        className="w-20"
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={maxBalance}
                        onChange={(e) => setMaxBalance(e.target.value)}
                        className="w-20"
                    />
                </div>
            </div>

            <Button
                onClick={() =>
                    onFilter({
                        customerId,
                        accountType,
                        minBalance: minBalance ? Number(minBalance) : undefined,
                        maxBalance: maxBalance ? Number(maxBalance) : undefined,
                    })
                }
            >
                Generate Report
            </Button>
        </div>
    );
}
