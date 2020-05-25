import Entity from "Entity";
import React, {Component, Context, createContext, Dispatch, Reducer, useReducer} from "react";

export interface EntityDispatch<A> {
    dispatch: Dispatch<A>
}

export default class EntityContextFactory<T extends Entity, S, A> extends Component {
    private readonly entityStateContext: Context<S>;
    private readonly entityDispatchContext: Context<EntityDispatch<A>>;
    private readonly entityReducer: Reducer<S, A>;
    private readonly initialState: S;

    constructor(props: any = {}, initialState: S, reducer: Reducer<S, A>) {
        super(props);
        this.initialState = initialState;
        this.entityReducer = reducer;
        this.entityStateContext = createContext<S>(initialState);
        this.entityDispatchContext = createContext<EntityDispatch<A>>({dispatch: () => null});
    }

    createAll = (): [Context<S>, Context<EntityDispatch<A>>, (props: { children: any }) => JSX.Element] => {
        return [this.entityStateContext, this.entityDispatchContext, this.entityContextProvider]
    };

    entityContextProvider = (props: { children: any }) => {
        const [entityState, entityDispatch] = useReducer(this.entityReducer, this.initialState);
        return (
            <this.entityStateContext.Provider value={entityState}>
                <this.entityDispatchContext.Provider value={{dispatch: entityDispatch}}>
                    {props.children}
                </this.entityDispatchContext.Provider>
            </this.entityStateContext.Provider>
        )
    }
}

