import { types } from 'mobx-state-tree';

export const Result = types.enumeration("Result", ['loading', 'error', 'success']);