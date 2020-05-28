/**
 * 创建不可重复的ID生成函数
 * @param initial
 */
export function create$uid(initial = 0) {
    let id = initial - 1;
    return function() {
        id++;
        return id;
    };
}

/**
 * 创建不可重复的ID
 */
export const $uid = create$uid(0);

/**
 * 特殊的键
 */
export const $KEY = '$pk';
