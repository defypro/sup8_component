import React, {ImgHTMLAttributes} from 'react';
import {Modal} from "antd";

class ImageView extends React.PureComponent<ImgHTMLAttributes<HTMLElement>> {
    state: { isView: boolean } = {
        isView: false
    };

    handleClick = () => {
        this.setState({
            isView: !this.state.isView
        });
    };

    render() {
        return (
            <>
                <img alt='' onClick={this.handleClick} {...this.props} style={{...this.props.style, cursor: 'pointer'}}/>
                <Modal
                    visible={this.state.isView}
                    footer={null}
                    onCancel={this.handleClick}
                >
                    <div style={{textAlign: 'center'}}>
                        <img alt='' width={'100%'} height={'100%'} src={this.props.src}/>
                    </div>
                </Modal>
            </>
        );
    }

}

export default ImageView;
