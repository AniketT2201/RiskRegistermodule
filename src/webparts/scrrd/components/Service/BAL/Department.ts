import { IScrrdProps } from '../../IScrrdProps';
import SPCRUDOPS from '../DAL/spcrudops';
import { IDepartment } from '../INTERFACE/IDepartment';

export interface DepartmentOps {
    getAllDepartment(props: IScrrdProps): Promise<IDepartment[]>;
    getDepartmentById(Id: string | number, props: IScrrdProps): Promise<IDepartment>;
    getDepartment(columnsToRetrieve: string, columnsToExpand: string, filters: string,
    orderby: { column: string; isAscending: boolean }, props: IScrrdProps): Promise<IDepartment[]>;
    getTopDepartment(columnsToRetrieve: string, columnsToExpand: string, filters: string,
    orderby: { column: string; isAscending: boolean }, props: IScrrdProps): Promise<IDepartment[]>;
}

export default function DepartmentOps() {
    const spCrudOps = SPCRUDOPS();

    const getAllDepartment = async (props: IScrrdProps): Promise<IDepartment[]> => {
        return await (await spCrudOps).getData("DepartmentMaster", "Id,Title,Status", "", ""
            , { column: 'Id', isAscending: false }, props).then(results => {
                var output: Array<IDepartment> = new Array<IDepartment>();
                results.map((item: any) => {
                    output.push({
                        Id: item.Id,
                        Title: item.Title,
                        Status: item.Status
                    });
                });
                return output;
            });
    };

    const getDepartmentById = async (Id: string | number, props: IScrrdProps): Promise<IDepartment> => {
        return await (await spCrudOps).getData("DepartmentMaster", "Id,Title,Status", "", "ID eq " + Id + ""
            , { column: 'Id', isAscending: false }, props).then(results => {
                var output: Array<IDepartment> = new Array<IDepartment>();
                results.map((item: any) => {
                    output.push({
                        Id: item.Id,
                        Title: item.Title,
                        Status: item.Status
                    });
                });
                return output[0];
            });
    };

    const getDepartment = async (columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string; isAscending: boolean; }, p0: number, props: IScrrdProps): Promise<IDepartment[]> => {
        return await (await spCrudOps).getData("DepartmentMaster", "Id,Title,Status", columnsToExpand, filters
            , orderby, props).then(results => {
                var output: Array<IDepartment> = new Array<IDepartment>();
                results.map((item: any) => {
                    output.push({
                        Id: item.Id,
                        Title: item.Title,
                        Status: item.Status
                    });
                });
                return output;
            });
    };

    const getTopDepartment = async (columnsToRetrieve: string, columnsToExpand: string, filters: string
            , orderby: { column: string, isAscending: boolean }, top: number, props: IScrrdProps): Promise<IDepartment[]> => {
            return await (await spCrudOps).getData("DepartmentMaster", "Id,Title,Status", columnsToExpand, filters
                , orderby, props).then(results => {
                    var output: Array<IDepartment> = new Array<IDepartment>();
                    results.map((item: any) => {
                        output.push({
                            Id: item.Id,
                        Title: item.Title,
                        Status: item.Status
                        });
                    });
                    return output;
                });
        };
    return {
        getAllDepartment,
        getDepartmentById,
        getDepartment,
        getTopDepartment
    };

}