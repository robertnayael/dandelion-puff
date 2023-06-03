export type State = {
    initialized: boolean;
    grid: {
        width: number;
        height: number;
        cellSize: number;
    },
    debug: Record<string, any>;
};


export type Action =
    { type: 'initialize', grid: State['grid'] }
|   { type: 'nextFrame', deltaTime: number }
