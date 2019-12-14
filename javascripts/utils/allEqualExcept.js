export default function allEqualExcept(key, obj1, obj2){
    const keys = Object.keys(obj1 || {});
    if (Object.keys(obj2 || {}).length !== keys.length) return false;
    for (let i=0; i<keys.length; i++){
        if (key === keys[i]) continue;
        if (obj1[keys[i]] !== obj2[keys[i]]) return false;
    }
    return true;
}