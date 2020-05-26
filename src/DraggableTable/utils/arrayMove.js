const arrayMove = (array, x, y) => {

    const tempElement = array[x];
    array[x] = array[y];
    array[y] = tempElement;
    return array;
};

export default arrayMove;