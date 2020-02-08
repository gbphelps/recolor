export default function debounce(func,limit){
    let lockTime = 0;
    let pending = null;
    
    return function(...args){
        const now = Date.now();
        if (!lockTime || lockTime + limit <= now){
            lockTime = now;
            func(...args);
        } else {
            if (pending) clearTimeout(pending);
            pending = setTimeout(()=>{
                func(...args);
            }, limit)
        }
    }
}
