import arrayMove from "./arrayMove";

const matrixMove = (matrix, x, y) => {
    let newMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
        newMatrix.push(arrayMove(matrix[i], x, y))
    }
    return newMatrix;
};

export default matrixMove;