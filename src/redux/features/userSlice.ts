import { createSlice } from "@reduxjs/toolkit"

export type User = {
    id: string
    name: string
    email: string
    role: 'learner' | 'instructor' | 'admin' | 'superadmin';
    status: "active" | "blocked"
    lastLogin: string
    createdAt: string
    avatarUrl?: string
}

interface UsersState {
    users: User[]
}

const initialState: UsersState = {
    users: [], // Will be initialized later
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload
        }
    },
})

export const {
    setUsers,
} = usersSlice.actions

export default usersSlice.reducer