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
    tagTypes: ['Followup', 'FollowupTab', 'CoreFollowup', 'Assignment', 'User', 'Part'],

    
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
        getAllRoles: builder.query({
            query: () => `User/GetAllRole/`,
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

        
        getActiveAssignment: builder.query({
            query: () => `Assignment/GetActiveAssignments`,
            providesTags: ['Assignment']
        }),
        getAllAssignment: builder.query({
            query: () => `Assignment/GetAllAssignments`,
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
        
    })
})

export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useActivateUserMutation,
    useDeactivateUserMutation,
    useUpdateUserMutation,
    useAssignUserToRoleMutation,
    useUnassignUserToRoleMutation,

    useUpdateFollowupMutation,
    useAddRemarkMutation,
    useAddFollowUpMutation,
    useAddFollowUpTabMutation,
    useUpdateFollowupTabMutation,
    useAddCoreFollowupMutation,

    useUpdateCoreFollowupMutation,
    useAddAssignmentMutation,
    useUpdateAssignmentMutation,

    useGetAllUsersQuery,
    useGetAllRolesQuery,

    useGetAllActiveFollowUpsTabsQuery,
    useGetAllTabsQuery,
    useGetAllActiveFollowUpsQuery,
    useGetFollowupTabByIdQuery,
    useGetAllActiveCoreFollowupQuery,
    useGetAllCoreFollowupQuery,
    useGetActiveAssignmentQuery,
    useGetAllAssignmentQuery,

    useAddPartMutation,
    useUpdatePartMutation,
    useGetAllPartQuery,
    useGetPartByIdQuery,
    useGetPartByPNQuery,
    useGetPartByPartialPNQuery,

} = apiSlice