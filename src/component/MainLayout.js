import React from 'react';
import { Flex, Layout, Menu, } from 'antd';
import ConnectButton from './ConnectButton';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Flex justify="space-between" align="center" style={{ width: "100vw"}}>
                    <div className="demo-logo" >logo</div>

                    <ConnectButton />
                </Flex>
            </Header>
            <Content style={{ padding: '0 48px', minHeight: "80vh" }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                App ©{new Date().getFullYear()} Created by Nartey
            </Footer>
        </Layout>
    );
};
