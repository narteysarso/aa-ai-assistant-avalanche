export const isValidThreadId = (thread_id) => {
    if(!thread_id) return false

    if(typeof thread_id !== "string") return false

    return true
}
