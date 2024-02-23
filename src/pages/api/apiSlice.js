import {createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {API_URL } from '../../config/index'
import { getSession, useSession } from 'next-auth/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: API_URL,
        prepareHeaders: async(headers) => {
            const session = await getSession()
            if(session?.token) {
                headers.set('Authorization', `Bearer ${session.token}`)
            }
            return headers
        }
    }),
    tagTypes: ['Followup', 'FollowupTab', 'CoreFollowup', 'Assignment', 'User', 'Part', 'Sales', 'Invoice', 'Company', 'Loan', 'Attachment'],
    
    endpoints: (builder) => ({

        // #region "User"
        createUser: builder.mutation({
            query: (data) => ({
                url: 'User/RegisterUser',
                method: 'POST',
                body: data
            })
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: 'User/LoginUser',
                method: 'POST',
                body: data
            }),
        }),
        activateUser: builder.mutation({
            query: (data) => ({
                url: 'User/ActivateUser',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        deactivateUser: builder.mutation({
            query: (data) => ({
                url: 'User/DeactivateUser',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: 'User/UpdateUser',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        assignUserToRole: builder.mutation({
            query: (data) => ({
                url: 'User/AssignUserToRole',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),

        createNewRole: builder.mutation({
            query: (data) => ({
                url: 'User/CreateNewRole',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),

        unassignUserToRole: builder.mutation({
            query: (data) => ({
                url: 'User/UnassignsUserToRole',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),

        getAllUsers: builder.query({
            query: () => `User/GetAllUsers/`,
            providesTags: ['User']
        }),
        getUserByUsername: builder.query({
            query: (username) => `User/GetUserByUsername?username=${username}`,
            providesTags: ['User']
        }),
        getAllRoles: builder.query({
            query: () => `User/GetAllRole`,
            providesTags: ['User']
        }),


        //#endregion

        // #region "Followup"
        addFollowUp: builder.mutation({
            query: (data) => ({
                url: 'AOGFollowUp/CreateAOGFollowUp',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Followup'],
        }),
        updateFollowup: builder.mutation({
            query: (data) => ({
                url: 'AOGFollowUp/UpdateAOGFollowUp',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Followup'],
        }),
        addRemark: builder.mutation({
            query: (data) => ({
                url: 'AOGFollowUp/AddRemarkInAOGFollowUp',
                method: 'POST',
                body: data
            })
        }),
        addFollowUpTab: builder.mutation({
            query: (data) => ({
                url: 'AOGFollowUp/CreateFollowUpTab',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['FollowupTab'],
        }),
        updateFollowupTab: builder.mutation({
            query: (data) => ({
                url: 'AOGFollowUp/UpdateFollowUpTab',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['FollowupTab'],
        }),

        addCoreFollowup: builder.mutation({
            query: (data) => ({
                url: 'CoreFollowUp/CreateCoreFollowUp',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['CoreFollowup'],
        }),
        updateCoreFollowup: builder.mutation({
            query: (data) => ({
                url: 'CoreFollowUp/UpdateCoreFollowUp',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['CoreFollowup'],
        }),
        
        
        getAllActiveFollowUpsTabs: builder.query({
            query: () => `AOGFollowUp/GetAllActiveFollowUpTabs/`,
            providesTags: ['FollowupTab', 'Followup']
        }),

        getAllTabs: builder.query({
            query: () => `AOGFollowUp/GetAllFollowUpTabs/`,
            providesTags: ['FollowupTab', 'Followup']
        }),
        getAllFollowUps: builder.query({
            query: (query) => `AOGFollowUp/GetAllAOGFollowUps?${query}`,
            providesTags: ['Followup']
        }),
        getAllActiveFollowUps: builder.query({
            query: () => `AOGFollowUp/GetAllActiveFollowUps/`,
            providesTags: ['Followup']
        }),
        getFollowupTabById: builder.query({
            query: (id) => `AOGFollowUp/GetFollowTabUpByID/${id}`,
            providesTags: ['Followup']
        }),
        getAllActiveCoreFollowup: builder.query({
            query: () => `CoreFollowUp/GetActiveCoreFollowUps`,
            providesTags: ['CoreFollowup']
        }),
        getAllCoreFollowup: builder.query({
            query: (data) => ({
                url: 'CoreFollowUp/GetAllCoreFollowUp',
                method: 'GET',
                params: data,
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
        }),
        
        // #endregion

        // #region "Assignment"
        addAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/CreateAssignment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),
        updateAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/UpdateAssignment',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),
        startAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/StartAssignment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),
        finishAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/FinishedAssignment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),
        reassignAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/ReassignAssignment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),
        reopenAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/ReopenAssignment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),
        closeAssignment: builder.mutation({
            query: (data) => ({
                url: 'Assignment/CloseAssignment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Assignment'],
        }),

        
        getActiveAssignment: builder.query({
            query: () => `Assignment/GetActiveAssignments`,
            providesTags: ['Assignment']
        }),
        getAllAssignment: builder.query({
            query: (query) => `Assignment/GetAllAssignments?${query}`,
            providesTags: ['Assignment'],
            invalidatesTags: ['Assignment'],
        }),
        getAssignmentById: builder.query({
            query: (id) => `Assignment/GetAssignmentUpByID/${id}`,
            providesTags: ['Assignment']
        }),
        // #endregion

        // #region "Part"
        addPart: builder.mutation({
            query: (data) => ({
                url: 'Part/CreatePart',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Part']
        }),
        updatePart: builder.mutation({
            query: (data) => ({
                url: 'Part/UpdatePart/',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Part']
        }),
        getAllPart: builder.query({
            query: () => `Part/GetAllParts`,
            providesTags: ['Part']
        }),

        getPartById: builder.query({
            query: (id) => `Part/GetPartByID/${id}`,
            providesTags: ['Part']
        }),

        getPartByPN: builder.query({
            query: (pn) => `Part/GetPartByPN/${pn}`,
            providesTags: ['Part']
        }),
        
        getPartByPartialPN: builder.query({
            query: (pn) => `Part/GetPartByPartialPN/${pn}`,
            providesTags: ['Part']
        }),
        // #endregion "Part"
        
        // #region Sales
        createSalesOrder: builder.mutation({
            query: (data) => ({
                url: 'Sales/CreateSales',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),
        updateSalesOrder: builder.mutation({
            query: (data) => ({
                url: 'Sales/UpdateSales',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),
        addPartList: builder.mutation({
            query: (data) => ({
                url: 'Sales/AddSalesPartList',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),
        updatePartList: builder.mutation({
            query: (data) => ({
                url: 'Sales/UpdateSalesPartList',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),

        shipSales: builder.mutation({
            query: (data) => ({
                url: 'Sales/ShipSales',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),

        salesApproval: builder.mutation({
            query: (data) => ({
                url: 'Sales/SalesApproval',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),

        salesCloser: builder.mutation({
            query: (data) => ({
                url: 'Sales/SalesCloser',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),

        getAllSalesOrder: builder.query({
            query: (query) => `Sales/GetAllSales?${query}`,
            providesTags: ['Sales']
        }),
        getSalesOrderById: builder.query({
            query: (id) => `Sales/GetSalesByID/${id}`,
            providesTags: ['Sales']
        }),
        getSalesOrderByCompanyId: builder.query({
            query: (companyId) => `Sales/GetSalesByCompanyId/${companyId}`,
            providesTags: ['Sales']
        }),
        getSalesOrderByOrderNo: builder.query({
            query: (orderNo) => `Sales/GetSalesByOrderNo/${orderNo}`,
            providesTags: ['Sales']
        }),
        getSalesOrderByCustomerOrderNo: builder.query({
            query: (customerOrderNo) => `Sales/GetAllGetSalesByCustomerOrderNo/${customerOrderNo}Sales`,
            providesTags: ['Sales']
        }),
        getAllActiveSalesOrder: builder.query({
            query: () => `Sales/GetAllActiveSales`,
            providesTags: ['Sales']
        }),

        getAllSalesPartList: builder.query({
            query: () => `Sales/GetAllSalesPartList`,
            providesTags: ['Sales']
        }),
        getSalesPartListByID: builder.query({
            query: (id) => `Sales/GetSalesPartListByID/${id}`,
            providesTags: ['Sales']
        }),

        // #endregion Sales

        // #region Invoice
        createInvoice: builder.mutation({
            query: (data) => ({
                url: 'Invoice/CreateInvoice',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Invoice', 'Sales', 'Loan']
        }),
        updateInvoice: builder.mutation({
            query: (data) => ({
                url: 'Invoice/UpdateInvoice',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Invoice', 'Sales', 'Loan']
        }),

        invoiceApproval: builder.mutation({
            query: (data) => ({
                url: 'Invoice/InvoiceApproval',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Invoice']
        }),
        invoiceCloser: builder.mutation({
            query: (data) => ({
                url: 'Invoice/InvoiceCloser',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Invoice']
        }),

        getAllInvoice: builder.query({
            query: (query) => `Invoice/GetAllInvoices?${query}`,
            providesTags: ['Invoice']
        }),
        getInvoiceByID: builder.query({
            query: (id) => `Invoice/GetInvoiceByID/${id}`,
            providesTags: ['Invoice']
        }),
        getInvoiceBySalesOrderId: builder.query({
            query: (orderId) => `Invoice/GetInvoiceBySalesOrderId/${orderId}`,
            providesTags: ['Invoice']
        }),
        getInvoiceByLoanOrderId: builder.query({
            query: (orderId) => `Invoice/GetInvoiceByLoanOrderId/${orderId}`,
            providesTags: ['Invoice']
        }),
        getInvoiceByInvoiceNo: builder.query({
            query: (invoiceNo) => `Invoice/GetInvoiceByInvoiceNo/${invoiceNo}`,
            providesTags: ['Invoice']
        }),
        getInvoicesByInvoiceNo: builder.query({
            query: (invoiceNo) => `Invoice/GetInvoicesByInvoiceNo/${invoiceNo}`,
            providesTags: ['Invoice']
        }),
        getApprovedInvoices: builder.query({
            query: () => `Invoice/GetApprovedlInvoices`,
            providesTags: ['Invoice']
        }),
        getUnapprovedInvoices: builder.query({
            query: () => `Invoice/GetUnapprovedlInvoices`,
            providesTags: ['Invoice']
        }),
        getActiveInvoices: builder.query({
            query: () => `Invoice/GetActiveInvoices`,
            providesTags: ['Invoice']
        }),
        getInvoicesByTransactionType: builder.query({
            query: (type) => `Invoice/GetInvoicesBytransactionType/${type}`,
            providesTags: ['Invoice']
        }),
        // #endregion Invoice
    
        // #region Company 
        createCompany: builder.mutation({
            query: (data) => ({
                url: 'Company/CreateCompany',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Company']
        }),
        updateCompany: builder.mutation({
            query: (data) => ({
                url: 'Company/UpdateCompany',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Company']
        }),

        getAllCompanies: builder.query({
            query: () => `Company/GetAllCompanies`,
            providesTags: ['Company']
        }),
        getCompanyByID: builder.query({
            query: (id) => `Company/GetCompanyByID/${id}`,
            providesTags: ['Company']
        }),
        getCompanyByCode: builder.query({
            query: (code) => `Company/GetCompanyByCode/${code}`,
            providesTags: ['Company']
        }),
        getCompanyByName: builder.query({
            query: (name) => `Company/GetCompanyByName/${name}`,
            providesTags: ['Company']
        }),
        //#endregion
    
        // #region Loan 
        createLoan: builder.mutation({
            query: (data) => ({
                url: 'Loan/CreateLoan',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        updateLoan: builder.mutation({
            query: (data) => ({
                url: 'Loan/UpdateLoan',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        loanApproval: builder.mutation({
            query: (data) => ({
                url: 'Loan/LoanApproval',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        addLoanPartList: builder.mutation({
            query: (data) => ({
                url: 'Loan/AddLoanPartList',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        updateLoanPartList: builder.mutation({
            query: (data) => ({
                url: 'Loan/UpdateLoanPartList',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        loanPartLineRemoval: builder.mutation({
            query: (data) => ({
                url: 'Loan/LoanPartLineRemoval',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        shipLoan: builder.mutation({
            query: (data) => ({
                url: 'Loan/ShipLoan',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        addOffer: builder.mutation({
            query: (data) => ({
                url: 'Loan/AddOffer',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        updateOffer: builder.mutation({
            query: (data) => ({
                url: 'Loan/UpdateOffer',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),
        loanCloser: builder.mutation({
            query: (data) => ({
                url: 'Loan/LoanCloser',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Loan']
        }),

        getAllLoans: builder.query({
            query: (query) => `Loan/GetAllLoans?${query}`,
            providesTags: ['Loan']
        }),
        getLoanByID: builder.query({
            query: (id) => `Loan/GetLoanByID/${id}`,
            providesTags: ['Loan']
        }),
        getLoanByByCompanyId: builder.query({
            query: (companyId) => `Loan/GetLoanByCompanyId/${companyId}`,
            providesTags: ['Loan']
        }),
        getLoanByOrderNo: builder.query({
            query: (orderNo) => `Loan/GetLoanByOrderNo/${orderNo}`,
            providesTags: ['Loan']
        }),
        getLoanByCustomerOrderNo: builder.query({
            query: (customerOrderNo) => `Loan/GetLoanByCustomerOrderNo/${customerOrderNo}`,
            providesTags: ['Loan']
        }),
        getAllActiveLoan: builder.query({
            query: () => `Loan/GetAllActiveLoan`,
            providesTags: ['Loan']
        }),
        getAllLoanPartList: builder.query({
            query: () => `Loan/GetAllLoanPartList`,
            providesTags: ['Loan']
        }),
        getLoanPartListByID: builder.query({
            query: (id) => `Loan/GetLoanPartListByID/${id}`,
            providesTags: ['Loan']
        }),
        getAllOffers: builder.query({
            query: () => `Loan/GetAllOffers/`,
            providesTags: ['Loan']
        }),
        getOfferByID: builder.query({
            query: (id) => `Loan/GetOfferByID/${id}`,
            providesTags: ['Loan']
        }),

        // #endregion

        // #region Attachment
        uploadAttachment: builder.mutation({
            query: (data) => ({
                url: 'Attachment/UploadAttachment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Attachment']
        }),
        updateAttachment: builder.mutation({
            query: (data) => ({
                url: 'Attachment/UpdateAttachment',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Attachment']
        }),

        getAttachmentById: builder.query({
            query: (id) => `Attachment/GetAttachmentById/${id}`,
            providesTags: ['Attachment']
        }),
        getAttachmentByFileName: builder.query({
            query: (fileName) => `Attachment/GetAttachmentByFileName/${fileName}`,
            providesTags: ['Attachment']
        }),
        getAttachmentLinkById: builder.query({
            query: (id) => `Attachment/GetAttachmentLinkById/${id}`,
            providesTags: ['Attachment']
        }),
        getAttachmentLinkByAttachmentId: builder.query({
            query: (attachmentId) => `Attachment/GetAttachmentLinkByAttachmentId/${attachmentId}`,
            providesTags: ['Attachment']
        }),
        getAttachmentLinkByEntityId: builder.query({
            query: ({entityId, entityType} ) => `Attachment/GetAttachmentLinkByEntityId/${entityId}/${entityType}`,
            providesTags: ['Attachment']
        }),

        // #endregion
    }) 
})

export const {

    // #region User
    useCreateUserMutation,
    useLoginUserMutation,
    useActivateUserMutation,
    useDeactivateUserMutation,
    useUpdateUserMutation,
    useAssignUserToRoleMutation,
    useUnassignUserToRoleMutation,
    useCreateNewRoleMutation,
    
    useGetAllUsersQuery,
    useGetAllRolesQuery,
    useGetUserByUsernameQuery,
    
    // #endregion 

    // #region followup 
    useUpdateFollowupMutation,
    useAddRemarkMutation,
    useAddFollowUpMutation,
    useAddFollowUpTabMutation,
    useUpdateFollowupTabMutation,
    useAddCoreFollowupMutation,

    useUpdateCoreFollowupMutation,


    useGetAllActiveFollowUpsTabsQuery,
    useGetAllTabsQuery,
    useGetAllFollowUpsQuery,
    useGetAllActiveFollowUpsQuery,
    useGetFollowupTabByIdQuery,

    useGetAllActiveCoreFollowupQuery,
    useGetAllCoreFollowupQuery,

    // #endregion 

    // #region assignment 
        useAddAssignmentMutation,
        useUpdateAssignmentMutation,
        useStartAssignmentMutation,
        useFinishAssignmentMutation,
        useReassignAssignmentMutation,
        useReopenAssignmentMutation,
        useCloseAssignmentMutation,
        
        useGetActiveAssignmentQuery,
        useGetAllAssignmentQuery,
        useGetAssignmentByIdQuery,
    // #endregion 

    // #region part
    useAddPartMutation,
    useUpdatePartMutation,

    useGetAllPartQuery,
    useGetPartByIdQuery,
    useGetPartByPNQuery,
    useGetPartByPartialPNQuery,
    // #endregion 

    // #region sales
    useCreateSalesOrderMutation,
    useUpdateSalesOrderMutation,
    useAddPartListMutation,
    useUpdatePartListMutation,
    useShipSalesMutation,
    useSalesApprovalMutation,
    useSalesCloserMutation,

    useGetAllSalesOrderQuery,
    useGetSalesOrderByIdQuery,
    useGetSalesOrderByCompanyIdQuery,
    useGetSalesOrderByCustomerOrderNoQuery,
    useGetSalesOrderByOrderNoQuery,
    useGetAllActiveSalesOrderQuery,
    useGetAllSalesPartListQuery,
    useGetSalesPartListByIDQuery,
    // #endregion 

    // #region invoice 
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useInvoiceApprovalMutation,
    useInvoiceCloserMutation,

    useGetAllInvoiceQuery,
    useGetInvoiceByIDQuery,
    useGetInvoiceBySalesOrderIdQuery,
    useGetInvoiceByLoanOrderIdQuery,
    useGetInvoiceByInvoiceNoQuery,
    useGetInvoicesByInvoiceNoQuery,
    useGetApprovedInvoicesQuery,
    useGetUnapprovedInvoicesQuery,
    useGetActiveInvoicesQuery,
    useGetInvoicesByTransactionTypeQuery,

    // #endregion

    // #region Company 
    useCreateCompanyMutation,
    useUpdateCompanyMutation,

    useGetAllCompaniesQuery,
    useGetCompanyByIDQuery,
    useGetCompanyByCodeQuery,
    useGetCompanyByNameQuery,
    // #endregion

    // #region Loan 
    useCreateLoanMutation,
    useUpdateLoanMutation,
    useLoanApprovalMutation,
    useAddLoanPartListMutation,
    useUpdateLoanPartListMutation,
    useLoanPartLineRemovalMutation,
    useShipLoanMutation,
    useAddOfferMutation,
    useUpdateOfferMutation,
    useLoanCloserMutation,

    useGetAllLoansQuery,
    useGetLoanByIDQuery,
    useGetLoanByByCompanyIdQuery,
    useGetLoanByOrderNoQuery,
    useGetLoanByCustomerOrderNoQuery,
    useGetAllActiveLoanQuery,
    useGetAllLoanPartListQuery,
    useGetLoanPartListByIDQuery,
    useGetAllOffersQuery,
    useGetOfferByIDQuery,
    // #endregion

    // #region Attachment
    useUploadAttachmentMutation,
    useUpdateAttachmentMutation,
    useGetAttachmentByIdQuery,
    useGetAttachmentByFileNameQuery,
    useGetAttachmentLinkByIdQuery,
    useGetAttachmentLinkByAttachmentIdQuery,
    useGetAttachmentLinkByEntityIdQuery,
    // #endregion 
    
} = apiSlice