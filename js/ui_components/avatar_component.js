export class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...props};
    }

    render() {
        return React.createElement(
            'img',
            {
                className: 'avatar',
                src: this.state.path_image,
                width: this.state.width,
                height: this.state.height,
                //href: 'https://Haxersociety.github.io/Diplom_ThreeJS',
            },
        );
    }
}