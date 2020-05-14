import Entity from "../Entity";
import React, {Component, Context, createContext, Dispatch, useReducer} from "react";

export enum CUDReducerActions {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export enum RestReducerActions {
    REFRESH = "REFRESH"
}

interface EntityState<T> {
    entities: T[]
}

type Action<T> = {
    action: CUDReducerActions
    payload: T
} | {
    action: RestReducerActions,
    payload: T[]
}


export interface EntityDispatch<T> {
    dispatch: Dispatch<Action<T>>
}


export default class EntityContextFactory<T extends Entity> extends Component {
    private readonly entityStateContext: Context<EntityState<T>>;
    private readonly entityDispatchContext: Context<EntityDispatch<T>>;

    constructor(props: any = {}, initialState?: EntityState<T>) {
        super(props);
        this.entityStateContext = createContext<EntityState<T>>(initialState || {entities: []});
        this.entityDispatchContext = createContext<EntityDispatch<T>>({dispatch: () => null});
    }

    entityReducer = (state: EntityState<T>, action: Action<T>): EntityState<T> => {
        switch (action.action) {
            case CUDReducerActions.CREATE:
                return {entities: [...state.entities, action.payload]};
            case CUDReducerActions.DELETE:
                return {entities: state.entities.filter(value => value.id !== action.payload.id)};
            case CUDReducerActions.UPDATE:
                return {entities: state.entities.map(value => value.id === action.payload.id ? action.payload : value)};

            case RestReducerActions.REFRESH:
                return {entities: action.payload};
        }
    };

    createAll = (): [Context<EntityState<T>>, Context<EntityDispatch<T>>, (props: { children: any }) => JSX.Element] => {
        return [this.entityStateContext, this.entityDispatchContext, this.entityContextProvider]
    };

    entityContextProvider = (props: { children: any }) => {
        const [entityState, entityDispatch] = useReducer(this.entityReducer, {entities: []});
        return (
            <this.entityStateContext.Provider value={entityState}>
                <this.entityDispatchContext.Provider value={{dispatch: entityDispatch}}>
                    {props.children}
                </this.entityDispatchContext.Provider>
            </this.entityStateContext.Provider>
        )
    }
}
