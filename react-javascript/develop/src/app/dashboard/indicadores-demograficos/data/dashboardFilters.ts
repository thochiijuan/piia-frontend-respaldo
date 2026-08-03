export interface FilterOption {

    label: string;

    value: string;

}

export interface DashboardFilter {

    id: string;

    placeholder: string;

    options: FilterOption[];

}

export interface DashboardFilters {

    filters: DashboardFilter[];

}