import * as Action from "../actions";

const initialState = {
    loading: false,
    error: null,
    page: 1, 
    limit: 10,
    totalElement: 0,
    status: null,
    list: [],
    employleList: [],
    positionList: {
        position: [],
        status: null,
        message: "",
    },
    departmentList: {
        department: [],
        status: null,
        message: "",
    },
    employeeCreateOrUpdate: null,
    employleDetail: {
        employleDetail: "",
        status: null,
        message: "",
    },
    salaryDatail: {
        salaryDatail: [],
        status: null,
        message: "",
    },
    timeKeeping: {
        timeKeeping: [],
        status: null,
        message: "",
    },
}

const dashboardReducer = (state  = initialState, action) => {
    switch (action.type) {
        case Action.LIST_EMPLOYEE_LOADING:
            return {
                ...state,
                loading: true,
                error: null,
                employeeCreateOrUpdate: null,
            };
        case Action.LIST_EMPLOYEE_FETCHED:
            return {
                ...state,
                loading: false,
                employleList: action.payload.data.data,
                page: action.payload.data.pageableRep.page,
                limit: action.payload.data.pageableRep.limit,
                totalElement: action.payload.data.pageableRep.totalElements,
                error: null,
                // employeeCreateOrUpdate: action.payload,
            }
        case Action.LIST_EMPLOYEE_SEARCH_FETCHED:
            return {
                ...state,
                loading: false,
                employleList: action.payload.data.data,
                page: action.payload.data.pageableRep.page,
                limit: action.payload.data.pageableRep.limit,
                totalElement: action.payload.data.pageableRep.totalElements,
                error: null,
                employeeCreateOrUpdate: action.payload,
            }
        
        case Action.LIST_EMPLOYEE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            }
        case Action.CREATE_EMPLOYEE:
            return {
                ...state,
                employleList: [...state.employleList, action.payload],
                employeeCreateOrUpdate: action.payload,
            }
        case Action.CREATE_EMPLOYEE_ERROR: 
            return {
                ...state,
                error: action.payload
            }
        case Action.UPDATE_EMPLOYEE:
            return {
                ...state,
                list: state.list.map((e) =>
                    e.id === action.payload.id ? action.payload : e
                ),
                employeeCreateOrUpdate: action.payload,
            }
        case Action.UPDATE_EMPLOYEE_ERROR: 
            return {
                ...state,
                error: action.payload
            }
        case Action.DELETE_EMPLOYEE:
            return {
                ...state,
                list: action.payload,
            }
        case Action.DELETE_EMPLOYEE_ERROR: 
            return {
                ...state,
                error: action.payload
            }
        case Action.LIST_POSITION_FETCHED:
            return {
                ...state,
                positionList: {
                    position: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                }
            }
        case Action.LIST_DEPARTMENT_FETCHED:
            return {
                ...state,
                departmentList: {
                    department: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                }
            }
        case Action.EMPLOYEE_DETAIL_FETCHED: 
            return {
                ...state,
                employleDetail: {
                    employleDetail: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                }
            }   
        case Action.SALARY_EMPLOYEE:
            return {
                ...state,
                salaryDatail: {
                    salaryDatail: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                }
            }  
            
        case Action.TIMEKEEPING_EMPLOYEE:
            return {
                ...state,
                timeKeeping: {
                    timeKeeping: action.payload.data,
                    status: action.payload.status,
                    message: action.payload.message,
                }
            }  
        default:
            return state;
    }
}

export default dashboardReducer;