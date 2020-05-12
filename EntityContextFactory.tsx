import React, {Component, Context, createContext, Dispatch, useReducer} from "react";

export default abstract class Entity {
    id: number;

    protected constructor(id: number) {
        this.id = id;
    }
}

export enum CUDReducerActions {
    CREATE,
    UPDATE,
    DELETE
}

interface EntityState<T> {
    entities: T[]
}


interface EntityAction<T> {
    action: CUDReducerActions,
    entity: T
}

interface EntityDispatch<T> {
    dispatch: Dispatch<EntityAction<T>>
}


export class EntityContextFactory<T extends Entity> extends Component {
    private readonly entityStateContext: Context<EntityState<T>>;
    private readonly entityDispatchContext: Context<EntityDispatch<T>>;

    constructor(props: any = {}) {
        super(props);
        this.entityStateContext = createContext<EntityState<T>>({entities: []});
        this.entityDispatchContext = createContext<EntityDispatch<T>>({dispatch: () => null});
    }

    reducer = (state: EntityState<T>, action: EntityAction<T>) => {
        switch (action.action) {
            case CUDReducerActions.CREATE:
                state.entities = [...state.entities, action.entity];
                break;
            case CUDReducerActions.DELETE:
                state.entities = state.entities.filter(value => value.id !== action.entity.id);
                break;
            case CUDReducerActions.UPDATE:
                state.entities = state.entities.map(value => value.id === action.entity.id ? action.entity : value);
                return state;
        }
        return state;
    };

    createAll = (): [Context<EntityState<T>>, Context<EntityDispatch<T>>, (props: { children: any }) => JSX.Element] => {
        return [this.createEntityStateContext(), this.createEntityDispatchContext(), this.createEntityContextProvider()]
    };

    createEntityStateContext = () => {
        return this.entityStateContext;
    };

    createEntityDispatchContext = () => {
        return this.entityDispatchContext;
    };

    createEntityContextProvider = () => {
        return (
            (props: { children: any }) => {
                const [entityState, entityDispatch] = useReducer(this.reducer, {entities: []});
                return (
                    <this.entityStateContext.Provider value={entityState}>
                        <this.entityDispatchContext.Provider value={{dispatch: entityDispatch}}>
                            {props.children}
                        </this.entityDispatchContext.Provider>
                    </this.entityStateContext.Provider>
                )
            }
        )
    }
}

