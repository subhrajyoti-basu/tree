let divide = 6;

export function updateXPosition(node:any, height: any, width: any) {
    if(node.depth == 1) divide = node.height + 1
    if (node.children && node.children.length > 0) {
        const childWidth= (width)/ divide ;
        const childheight = height;

        // Loop through children and update their 'x' position recursively
        node.children.forEach((childNode:any, index:number) => {
            childNode.y = index * childheight
            childNode.x = (childNode.depth -1 ) * childWidth
            updateXPosition(childNode, height, width);
        });
    }
}

// Assuming 'Node' is a class representing your nodes and 'rootNode' is the root node of your tree
// You can call the function with the root node and initial width (100 in this case)
