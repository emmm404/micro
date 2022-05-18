import React from 'react';
import axios from 'axios';
import config from '../../build/config';

class MicroFrontend extends React.Component {

    appendChild = (element,obj)=>{
        let Eobj = obj;
        let ele = document.createElement(element);
        for(let k in Eobj){
            ele[k] = Eobj[k];
        }
        document.head.appendChild(ele);
    }

    async componentDidMount() {
        const { module, document } = this.props;
        const scriptId = `micro-frontend-script-${module}`;
        const linkId = `micro-frontend-link-${module}`;

        if(document.getElementById(scriptId) || document.getElementById(linkId)){
            this.renderMicroFrontend();
            return;
        }
        const { port, publicPath } = config[module];
        if (process.env.NODE_ENV === 'development') {
            const host = `http://127.0.0.1:${port}${publicPath}`;
            this.loadPage(host, linkId, scriptId).catch(() => {
                console.error(`尝试加载本地开发模块【${module}】失败，更改为加载本地部署目录文件`);
                this.loadPage(publicPath, linkId, scriptId).catch(() => {
                    console.error(`尝试加载模块【${module}】本地部署目录文件失败`);
                });
            });
        } else {
            this.loadPage(publicPath, linkId, scriptId).catch(() => {
                console.error(`尝试加载模块【${module}】部署目录文件失败`);
            });
        }
    }

    loadPage = async (host, linkId, scriptId) => {
        const { data } = await axios.get(`${host}asset-manifest.json`,{
            baseURL:'/'
        }).catch((e) => {
            throw e;
        });
        this.appendChild('link',{
            rel:'stylesheet',
            id:linkId,
            type:'text/css',
            href:data['main.css']
        });
        //入口JS
        this.appendChild('script',{
            id:scriptId,
            type:'text/javascript',
            src:data['main.js'],
            onload:this.renderMicroFrontend
        });
    }
    
    componentWillUnmount() {
        const { module, window } = this.props;
        //Dom ID
        let domId = `${module}-container`;
        //卸载
        const { renderKey } = config[module];
        window[`unmount${renderKey}`] && window[`unmount${renderKey}`](domId);
    }

    renderMicroFrontend = () => {
        const { module, props } = this.props;
        //Dom ID
        let domId = `${module}-container`;
        //挂载
        const { renderKey } = config[module];
        window[`render${renderKey}`] && window[`render${renderKey}`](domId,props);
    };

    render() {
        return <div id={`${this.props.module}-container`} />;
    }
}

MicroFrontend.defaultProps = {
    document,
    window
};

export default MicroFrontend;
