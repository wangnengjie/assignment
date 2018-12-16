let key_id = 0;
const TEXT = 0; //因为children里面会有文本节点，所以遍历子节点的时候node可能为string
const ATTR = 1; //这个就是属性变更了，class value key event等等一些东西
const REPLACE = 2; //节点替换，用于整个节点替换的情况，其实也就是tagName都变了
const LISTDIFF = 3; //用于listdiff的时候
const CREATE = 4; //新增节点
const REMOVE = 5; //删除节点
const DELETE = 6;
const INSERT = 7;
class visualDom{
    constructor(tagName,props,children){
        this.tagName=tagName;
        this.props=props||{};
        this.children=children||[];
    }

    diff(oldTree){
        let index = 0; //咦，原来索引的英文就是index啊2333
        let patches = {}; //然后patch果然就是补丁本意么……
        key_id = 0;
        traversal(oldTree, this, index, patches);
        console.log(patches);
        patch(document.querySelector("#main"),this,patches);
    }

    render() {
        let create = document.createElement(this.tagName);
        let props = this.props;
        let children = this.children;
        for (let i in props) {
            if (i !== "key") {
                create.setAttribute(i, props[i]);
            }
        }
        children.forEach(child => {
            if(type(child)==="Null"){
                let temp=document.createComment("注释节点");
                create.appendChild(temp);
            }else if(type(child)==="String"){
                let temp=document.createTextNode(child);
                create.appendChild(temp);
            }else if (type(child) === "Array") {
                for (let i = 0; i < child.length; i++) {
                    let temp = child[i].render();
                    create.appendChild(temp);
                }
            } else {
                let temp = child.render();
                create.appendChild(temp);
            }
        })
        return create;
    }
}

function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
}

function createElement(tagName,props,...children){
    return new visualDom(tagName,props,children);
}

function patch(node, newTree, patches) {
    key_id = 0;
    setPatches(node, newTree, patches, key_id);
}

function traversal(oldNode, newNode, index, patches) {
    let currentIndexPatch = []; //有变化则返回一个数组，下标为节点索引，后续可用作每个节点的变化
    if (!oldNode && newNode) {
        currentIndexPatch.push({
            change: CREATE,
            node: newNode
        });
    } else if (!newNode && oldNode) {
        currentIndexPatch.push({
            change: REMOVE,
            node: null
        });
    } else if (type(oldNode) === "String" && type(newNode) === "String") {
        if (!(oldNode === newNode))
            currentIndexPatch.push({
                change: TEXT,
                text: newNode
            });
    } else if (type(oldNode) === "Array" && type(newNode) === "Array") {
        let moves = listDiff(oldNode, newNode, patches);
        if (moves.length !== 0) {
            currentIndexPatch.push({
                change: LISTDIFF,
                moves: moves
            })
        }
    } else if (newNode.tagName === oldNode.tagName) {
        let propsChange = diffProps(oldNode, newNode);
        if (propsChange !== null) {
            currentIndexPatch.push({
                change: ATTR,
                props: propsChange
            })
        }
        diffChildren(oldNode.children, newNode.children, patches);
    } else { //整个节点都替换了
        currentIndexPatch.push({
            change: REPLACE,
            node: newNode
        })
    }

    if (currentIndexPatch.length > 0) {
        patches[index] = currentIndexPatch
    }
}

function diffProps(oldNode, newNode) {
    let oldProp = oldNode.props;
    let newProp = newNode.props;
    let propsChange = {};
    let num = 0;
    for (let key in oldProp) {
        if (!newProp.hasOwnProperty(key)) {
            num++;
            propsChange[key] = null;
        } else if (oldProp[key] !== newProp[key]) {
            num++;
            propsChange[key] = newProp[key];
        }
    }
    for (let key in newProp) {
        if (!oldProp.hasOwnProperty(key)) {
            num++;
            propsChange[key] = newProp[key];
        }
    }
    if (num === 0) {
        return null;
    }
    return propsChange;
}

function diffChildren(oldChildren, newChildren, patches) {
    oldChildren.forEach((child, i) => {
        key_id++;
        let newChild = newChildren[i];
        traversal(child, newChild, key_id, patches);
    })
}

function listDiff(oldList, newList, patches) {
    let simulateList = [];
    let moves = [];
    let deleteCount=0;
    /*遍历旧表，找出新表中不存在的key并删除，按旧表顺序，将新表中也存在的key存入simulateList*/
    oldList.forEach((node, keyIndex) => {
        let currentOldKey = node.props.key;
        for (let i = 0; i < newList.length; i++) {
            let currentNewKey = newList[i].props.key;
            if (currentNewKey === currentOldKey) {
                simulateList.push(currentOldKey);
                break;
            }
            if (i === newList.length - 1) {
                moves.push({
                    change: DELETE,
                    index: keyIndex-deleteCount
                })
                deleteCount++;
            }
        }
    })
    newList.forEach((node, keyIndex) => {
        let currentNewKey = node.props.key;
        if (simulateList[keyIndex] === currentNewKey) {;
        } else if (keyIndex + 1 < simulateList.length && simulateList[keyIndex + 1] === currentNewKey) {
            simulateList.splice(keyIndex, 1);
            moves.push({
                change: DELETE,
                index: keyIndex
            })
        } else {
            simulateList.splice(keyIndex, 0, currentNewKey)
            moves.push({
                change: INSERT,
                index: keyIndex,
                node: node
            })
        }
    })
    newList.forEach((node) => {
        let has = false;
        let currentNewKey = node.props.key;
        /**对旧节点进行遍历diff */
        for (let i = 0; i < oldList.length; i++) {
            let currentOldNode = oldList[i]
            let currentOldKey = currentOldNode.props.key;
            if (currentNewKey === currentOldKey) {
                has = true;
                traversal(currentOldNode, node, key_id, patches);
            }
        }
        /**新增节点计算偏移量 */
        if (has === false) {
            countKey_id(node);
        }
    })
    return moves;
}

function countKey_id(newNodeInList) {
    for (let i = 0; i < newNodeInList.children.length; i++) {
        key_id++;
        if (type(newNodeInList.children[i]) === "Object") {
            countKey_id(newNodeInList.children[i]);
        } else if (type(newNodeInList.children[i]) === "Array") {
            let deepList = newNodeInList.children[i];
            for (let j = 0; j < deepList.length; j++) {
                countKey_id(deepList[j]);
            }
        }
    }
}

function setPatches(node, newVDOM, patches, index) {
    let children;
    if(!(type(newVDOM)==="Null")){
        children=newVDOM.children;
    }
    let newNode;
    if (patches.hasOwnProperty(index)) {
        let currentPatches = patches[index];
        let whatChange = currentPatches[0];
        switch (whatChange.change) {
            case TEXT:
                node.textContent = whatChange.text;
                return;
            case ATTR:
                setATTR(node, whatChange.props);
                break;
            case REPLACE:
                if(type(whatChange.node)==="String"){
                    newNode=document.createTextNode(whatChange.node);
                }else if(type(whatChange.node)==="Null"){
                    newNode=document.createComment("注释节点");
                }else{
                    newNode = whatChange.node.render();
                }
                node.parentNode.replaceChild(newNode, node);
                return;
            case LISTDIFF:
                setListDiff(node, whatChange.moves);
                delete patches[index];
                break;
            case CREATE:
                if(type(whatChange.node)==="String"){
                    newNode=document.createTextNode(whatChange.node);
                }else{
                    newNode = whatChange.node.render();
                }
                node.parentNode.replaceChild(newNode, node);
                return;
            case REMOVE:
                newNode = document.createComment("注释节点");
                node.parentNode.replaceChild(newNode, node);
                return;
            default:
                break;
        }
    }
    if (children === undefined)
        return;
    let len = children.length;
    let j = 0;
    for (let i = 0; i < len; i++) {
        key_id++;
        if (type(children[i]) === "Array") {
            for (let k = 0; k < children[i].length; k++) {
                setPatches(node.childNodes[i + j], children[i][k], patches, key_id);
                if(k!==children[i].length-1){
                    j++;
                }
            }
        } else {
            setPatches(node.childNodes[i + j], children[i], patches, key_id);
        }
    }
}

function setATTR(node, props) {
    for (let key in props) {
        if (props[key] === null) {
            node.removeAttribute(key)
        } else {
            node.setAttribute(key, props[key])
        }
    }
}

function setListDiff(node, moves) {
    let empty=false;
    let parent=node.parentNode;
    moves.forEach(move => {
        if (move.change === DELETE) {
            let currentNode = node;
            let index = move.index;
            if(index===0&&currentNode.nextElementSibling){
                node=node.nextElementSibling;
                currentNode.parentNode.removeChild(currentNode);
                return;
            }else if(index===0&&!currentNode.nextElementSibling){
                empty=true;
                currentNode=document.createComment("注释节点");
                node.parentNode.replaceChild(currentNode, node);
                node=currentNode;
                return;
            }
            for (let i = 0; i < index; i++) {
                currentNode = currentNode.nextElementSibling;
            }
            currentNode.parentNode.removeChild(currentNode);
        } else if (move.change === INSERT) {
            if(empty===true){
                node.parentNode.replaceChild(move.node.render(), node);
                node=move.node.render();
                empty=false;
                return;
            }
            let currentNode = node;
            let index = move.index;
            for (let i = 0; i < index; i++) {
                if(!currentNode.nextElementSibling){
                    parent.appendChild(move.node.render());
                    return;
                }
                currentNode = currentNode.nextElementSibling;
            }
            node.parentNode.insertBefore(move.node.render(), currentNode);
        }
    })
}

let oldTree = createElement(
    "div", {
        class: "big",
        id: "main"
    }, null,
    createElement("span", {
        class: "big-inner",
    }, "hehe"),
    createElement("span", {
        class: "big-inner",
    }, "hehe", createElement("span", {
        class: "big-inner",
    }, "hehe")),
    ["a", "b", "c", "d", "f", "e"].map(n =>
        createElement("span", {
            class: "big-inner-number",
            key: n
        }, ["big", "old"].map(q => createElement("span", {
            class: "big-inner-number",
            key: q
        }, q)))
    ),
    createElement("span", {
        class: "big-inner",
    }, "hehe"), null
);
let newTree = createElement(
    "div", {
        class: "big",
        id: "main"
    }, "testasuidna",
    createElement("span", {
        class: "big-inner",
    }, "hehe"),
    createElement("span", {
        class: "large-inner abcdefg",
    }, "hehe", null),
    ["a", "c", "b", "d", "g", "e","m"].map(n =>
        createElement("span", {
            class: "big-inner-number",
            key: n
        }, ["111", "233"].map(q => createElement("span", {
            class: "big-inner-number",
            key: q
        }, q)))),
    createElement("span", {
        class: "big-inner",
    }, "hehehe"),
    createElement("iframe", {
        class: "big-inner",
    }, "hehe")
);

console.log(oldTree);
console.log(newTree);
document.body.appendChild(oldTree.render());
newTree.diff(oldTree);