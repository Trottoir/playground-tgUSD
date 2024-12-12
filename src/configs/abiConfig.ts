export const ABI_CONFIG = {
    ConvexCrvLPMarket: {
        view: {
            debtIndex: {
                format: 'formatEther',
            },
            lastDebt: {
                format: 'formatEther',
            },
            totalDebt: {
                format: 'formatEther',
            },
            lastIR: {
                format: 'formatEther',
            },
            pendingInterests: {
                format: 'formatEther',
            },
            minimumLoan: {
                format: 'formatEther',
            },
            maxMarketDebt: {
                format: 'formatEther',
            },
            collateralBalances: {
                format: 'formatEther',
                defaultParams: ['msg.sender'],
            },
            healthRatio: {
                format: 'formatEther',
                defaultParams: ['msg.sender'],
            },
            liquidationPrice: {
                format: 'formatEther',
                defaultParams: ['msg.sender'],
            },
            maxBorrowable: {
                format: 'formatEther',
                defaultParams: ['msg.sender'],
            },
            positionDebt: {
                format: 'formatEther',
                defaultParams: ['msg.sender'],
            },
            positionDebtIndex: {
                format: 'formatEther',
                defaultParams: ['msg.sender'],
            },
        },
    },
};
