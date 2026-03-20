// import { getSP } from "./pnpjsConfig";
import { IScrrdProps } from "../../IScrrdProps";
import { Web } from "@pnp/sp/presets/all";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// export interface ISPCRUDOPS {
//   getData(
//     listName: string,
//     columnsToRetrieve?: string,
//     columnsToExpand?: string,
//     filters?: string,
//     orderby?: { column: string; isAscending: boolean },
//     props?: IScrrdProps
//   ): Promise<any>;

//   getRootData(
//     listName: string,
//     columnsToRetrieve?: string,
//     columnsToExpand?: string,
//     filters?: string,
//     orderby?: { column: string; isAscending: boolean },
//     props?: IScrrdProps
//   ): Promise<any>;

//   insertData(listName: string, data: any, props: IScrrdProps): Promise<any>;
//   updateData(listName: string, itemId: number, data: any, props: IScrrdProps): Promise<any>;
//   deleteData(listName: string, itemId: number, props: IScrrdProps): Promise<any>;

//   getListInfo(listName: string, props: IScrrdProps): Promise<any>;
//   getListData(listName: string, columnsToRetrieve: string, props: IScrrdProps): Promise<any>;

//   batchInsert(listName: string, data: any[], props: IScrrdProps): Promise<any>;
//   batchUpdate(listName: string, data: any[], props: IScrrdProps): Promise<any>;
//   batchDelete(listName: string, data: any[], props: IScrrdProps): Promise<any>;

//   createFolder(listName: string, folderName: string, props: IScrrdProps): Promise<any>;
//   uploadFile(folderServerRelativeUrl: string, file: File, props: IScrrdProps): Promise<any>;
//   deleteFile(fileServerRelativeUrl: string, props: IScrrdProps): Promise<any>;

//   currentProfile(props: IScrrdProps): Promise<any>;
//   getLoggedInSiteGroups(props: IScrrdProps): Promise<any>;
//   getAllSiteGroups(props: IScrrdProps): Promise<any>;

//   getTopData(
//     listName: string,
//     columnsToRetrieve: string,
//     columnsToExpand: string,
//     filters: string,
//     orderby: { column: string; isAscending: boolean },
//     top: number,
//     props: IScrrdProps
//   ): Promise<any>;

//   addAttchmentInList(
//     data: File,
//     listName: string,
//     itemId: number,
//     fileName: string,
//     props: IScrrdProps
//   ): Promise<any>;
// }

// class SPCRUDOPSImpl implements ISPCRUDOPS {

//   private sp(props: IScrrdProps) {
//     if (!props?.currentSPContext) {
//       throw new Error("SharePoint context not available");
//     }
//     return getSP(props.currentSPContext);
//   }

//   async getData(listName: string, columnsToRetrieve?: string, columnsToExpand?: string,
//     filters?: string, orderby?: { column: string; isAscending: boolean }, props?: IScrrdProps): Promise<any> {

//     const sp = this.sp(props!);
//     let items = sp.web.lists.getByTitle(listName).items;

//     if (columnsToRetrieve) items = items.select(columnsToRetrieve);
//     if (columnsToExpand) items = items.expand(columnsToExpand);
//     if (filters) items = items.filter(filters);
//     if (orderby) items = items.orderBy(orderby.column, orderby.isAscending);

//     return await items();
//   }

//   async getRootData(listName: string, columnsToRetrieve?: string, columnsToExpand?: string,
//     filters?: string, orderby?: { column: string; isAscending: boolean }, props?: IScrrdProps): Promise<any> {

//     return this.getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
//   }

//   async insertData(listName: string, data: any, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName).items.add(data);
//   }

//   async updateData(listName: string, itemId: number, data: any, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName).items.getById(itemId).update(data);
//   }

//   async deleteData(listName: string, itemId: number, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName).items.getById(itemId).recycle();
//   }

//   async getListInfo(listName: string, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName)();
//   }

//   async getListData(listName: string, columnsToRetrieve: string, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName).items.select(columnsToRetrieve)();
//   }

//   async batchInsert(listName: string, data: any[], props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     const batch = sp.web.createBatch();

//     data.forEach(item => {
//       sp.web.lists.getByTitle(listName).items.inBatch(batch).add(item);
//     });

//     await batch.execute();
//   }

//   async batchUpdate(listName: string, data: any[], props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     const batch = sp.web.createBatch();

//     data.forEach(item => {
//       sp.web.lists.getByTitle(listName).items.getById(item.Id).inBatch(batch).update(item);
//     });

//     await batch.execute();
//   }

//   async batchDelete(listName: string, data: any[], props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     const batch = sp.web.createBatch();

//     data.forEach(item => {
//       sp.web.lists.getByTitle(listName).items.getById(item.Id).inBatch(batch).delete();
//     });

//     await batch.execute();
//   }

//   async createFolder(listName: string, folderName: string, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName).rootFolder.folders.addUsingPath(folderName);
//   }

//   async uploadFile(folderServerRelativeUrl: string, file: File, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.getFolderByServerRelativeUrl(folderServerRelativeUrl)
//       .files.add(file.name, file, true);
//   }

//   async deleteFile(fileServerRelativeUrl: string, props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.getFileByServerRelativeUrl(fileServerRelativeUrl).recycle();
//   }

//   async currentProfile(props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.currentUser();
//   }

//   async getLoggedInSiteGroups(props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.currentUser.groups();
//   }

//   async getAllSiteGroups(props: IScrrdProps): Promise<any> {
//     const sp = this.sp(props);
//     return await sp.web.siteGroups();
//   }

//   async getTopData(listName: string, columnsToRetrieve: string, columnsToExpand: string,
//     filters: string, orderby: { column: string; isAscending: boolean }, top: number, props: IScrrdProps): Promise<any> {

//     const sp = this.sp(props);
//     let items = sp.web.lists.getByTitle(listName).items
//       .select(columnsToRetrieve)
//       .expand(columnsToExpand)
//       .top(top);

//     if (filters) items = items.filter(filters);
//     if (orderby) items = items.orderBy(orderby.column, orderby.isAscending);

//     return await items();
//   }

//   async addAttchmentInList(data: File, listName: string, itemId: number,
//     fileName: string, props: IScrrdProps): Promise<any> {

//     const sp = this.sp(props);
//     return await sp.web.lists.getByTitle(listName)
//       .items.getById(itemId)
//       .attachmentFiles.add(fileName, data);
//   }
// }

// export default function SPCRUDOPS(): Promise<ISPCRUDOPS> {
//   return Promise.resolve(new SPCRUDOPSImpl());
// }



export interface ISPCRUDOPS {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IScrrdProps): Promise<any>;
    getRootData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IScrrdProps): Promise<any>;
    insertData(listName: string, data: any, props: IScrrdProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: IScrrdProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: IScrrdProps): Promise<any>;
    getListInfo(listName: string, props: IScrrdProps): Promise<any>;
    getListData(listName: string, columnsToRetrieve: string, props: IScrrdProps): Promise<any>;
    batchInsert(listName: string, data: any, props: IScrrdProps): Promise<any>;
    batchUpdate(listName: string, data: any, props: IScrrdProps): Promise<any>;
    batchDelete(listName: string, data: any, props: IScrrdProps): Promise<any>;
    createFolder(listName: string, folderName: string, props: IScrrdProps): Promise<any>;
    uploadFile(folderServerRelativeUrl: string, file: File, props: IScrrdProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IScrrdProps): Promise<any>;
    currentProfile(props: IScrrdProps): Promise<any>;
    //currentUserProfile(props: IDeviationuatProps): Promise<any>;
    getLoggedInSiteGroups(props: IScrrdProps): Promise<any>;
    getAllSiteGroups(props: IScrrdProps): Promise<any>;
    //   getTopData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //       , orderby: { column: string, isAscending: boolean }, top: number, props: IScrrdProps): Promise<any>;
    addAttchmentInList(data: File, listName: string, itemId: number, fileName: string, props: IScrrdProps): Promise<any>;
}

class SPCRUDOPSImpl implements ISPCRUDOPS {
    // async getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IScrrdProps): Promise<any> {
    //     if (!props.currentSPContext || !props.currentSPContext.pageContext) {
    //         throw new Error('SharePoint context is not available');
    //     }
    //     const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
    //     let items = web.lists.getByTitle(listName).items;
    //     if (columnsToRetrieve) {
    //         items = items.select(columnsToRetrieve);
    //     }
    //     if (columnsToExpand) {
    //         items = items.expand(columnsToExpand);
    //     }
    //     if (filters) {
    //         items = items.filter(filters);
    //     }
    //     if (orderby) {
    //         items = items.orderBy(orderby.column, orderby.isAscending);
    //     }
    //     return await items.getAll();
    // }


    async getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IScrrdProps): Promise<any> {
        if (!props.currentSPContext || !props.currentSPContext.pageContext) {
            throw new Error('SharePoint context is not available');
        }
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let items = web.lists.getByTitle(listName).items;
        if (columnsToRetrieve) {
            items = items.select(columnsToRetrieve);
        }
        if (columnsToExpand) {
            items = items.expand(columnsToExpand);
        }
        if (filters) {
            items = items.filter(filters);
        }
        if (orderby) {
            items = items.orderBy(orderby.column, orderby.isAscending);
        }
        return await items.getAll();
    }

    //     async getUserIdByEmail(
    //     context: props.,
    //     email: string
    //   ): Promise<number> {

    //     // const sp = spfi().using(SPFx(context));

    //     const user = await sp.web.ensureUser(email);
    //     return user.data.Id; // ✅ SharePoint numeric User ID
    //   }

    async getRootData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: { column: string, isAscending: boolean }, props: IScrrdProps): Promise<any> {
        if (!props.currentSPContext || !props.currentSPContext.pageContext) {
            throw new Error('SharePoint context is not available');
        }
        const fullUrl = props.currentSPContext.pageContext.web.absoluteUrl;
        const parts = fullUrl.split('/');
        const baseUrl = parts.slice(0, 5).join('/');
        const web = Web(baseUrl);
        let items = web.lists.getByTitle(listName).items;
        if (columnsToRetrieve) {
            items = items.select(columnsToRetrieve);
        }
        if (columnsToExpand) {
            items = items.expand(columnsToExpand);
        }
        if (filters) {
            items = items.filter(filters);
        }
        if (orderby) {
            items = items.orderBy(orderby.column, orderby.isAscending);
        }
        return await items.getAll();
    }
    async insertData(listName: string, data: any, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.add(data);
    }

    async updateData(listName: string, itemId: number, data: any, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).update(data);
    }

    async deleteData(listName: string, itemId: number, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).recycle();
    }

    async getListInfo(listName: string, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).get();
    }

    async getListData(listName: string, columnsToRetrieve: string, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let items = web.lists.getByTitle(listName).items;
        if (columnsToRetrieve) {
            items = items.select(columnsToRetrieve);
        }
        return await items.get();
    }

    async batchInsert(listName: string, data: any, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const entityTypeFullName = await web.lists.getByTitle(listName).getListItemEntityTypeFullName();
        const batch = web.createBatch();
        data.forEach((item: any) => {
            void web.lists.getByTitle(listName).items.inBatch(batch).add(item, entityTypeFullName);
        });
        return await batch.execute();
    }

    async batchUpdate(listName: string, data: any, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const batch = web.createBatch();
        data.forEach((item: any) => {
            void web.lists.getByTitle(listName).items.getById(item.Id).inBatch(batch).update(item);
        });
        return await batch.execute();
    }

    async batchDelete(listName: string, data: any, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const batch = web.createBatch();
        data.forEach((item: any) => {
            void web.lists.getByTitle(listName).items.getById(item.Id).inBatch(batch).delete();
        });
        return await batch.execute();
    }

    async createFolder(listName: string, folderName: string, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await void web.lists.getByTitle(listName).rootFolder.folders.addUsingPath(folderName);
    }

    async uploadFile(folderServerRelativeUrl: string, file: File, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await void web.getFolderByServerRelativeUrl(folderServerRelativeUrl).files.add(file.name, file, true);
    }

    async deleteFile(fileServerRelativeUrl: string, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await void web.getFileByServerRelativeUrl(fileServerRelativeUrl).recycle();
    }

    // async currentProfile(props: IScrrdProps): Promise<any> {
    //     const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
    //     return await web.currentUser.get();
    // }

    async currentProfile(props: IScrrdProps): Promise<any> {
        try {
            const profile = void await sp.profiles.myProperties.get();
            return profile;
        } catch (error) {
            console.error("Error fetching user profile", error);
            return null;
        }
    }

    async getLoggedInSiteGroups(props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await void web.currentUser.groups.get();
    }

    async getAllSiteGroups(props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await void web.siteGroups.get();
    }

    //   async getTopData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
    //       , orderby: { column: string, isAscending: boolean }, top: number, props: IScrrdProps): Promise<any> {
    //       const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
    //       let items = void web.lists.getByTitle(listName).items;
    //       if (columnsToRetrieve) {
    //           items = items.select(columnsToRetrieve);
    //       }
    //       if (columnsToExpand) {
    //           items = items.expand(columnsToExpand);
    //       }
    //       if (filters) {
    //           items = items.filter(filters);
    //       }
    //       if (orderby) {
    //           items = items.orderBy(orderby.column, orderby.isAscending);
    //       }
    //       if (top) {
    //           items = items.top(top);
    //       }
    //       return await items.get();
    //   }

    async addAttchmentInList(data: File, listName: string, itemId: number, fileName: string, props: IScrrdProps): Promise<any> {
        const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await void web.lists.getByTitle(listName).items.getById(itemId).attachmentFiles.add(fileName, data);
    }
}

export default function SPCRUDOPS(): Promise<ISPCRUDOPS> {
    return Promise.resolve(new SPCRUDOPSImpl());
}