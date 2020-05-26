const getTranslateY = (el) => {
    let transform = el.style.transform;
    return parseInt(transform.replace('translateY(', "").replace("px)", ""));
};
export default getTranslateY;