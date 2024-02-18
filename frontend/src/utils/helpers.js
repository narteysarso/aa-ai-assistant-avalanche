export const isValidThreadId = (thread_id) => {
    if(!thread_id) return false

    if(typeof thread_id !== "string") return false

    if(thread_id.indexOf("thread") > 0) return false

    if(thread_id.split("_").length !== 2) return false;

    return true
}
