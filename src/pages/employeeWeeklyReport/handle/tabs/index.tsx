import { Form, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { useDispatch, useSelector } from 'react-redux';
import WorkContent from './components/workContent';
import BookReview from './components/BookReview';
import { FormInstance } from 'antd/es/form/Form';


const index = ({ form,reviewContent,workContent,isView }: any) => {

    const [currentTabIndex, setCurrentTabIndex] = useState(1);


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 16,
                    }}>
                    Nội dung công việc
                </span>
            ),
            children: <WorkContent form={form} value={workContent} isView={isView}/>,
        },
        {
            key: '2',
            label: (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 16,
                    }}>
                    Review sách
                </span>
            ),
            children: (
                <BookReview form={form} value={reviewContent} isView={isView}/>
            ),
        },
    ];
    // ================================
    // Handler
    // ================================
    const onChange = (key: string) => {
        setCurrentTabIndex(Number(key));
    };
    return (
        <Tabs
            defaultActiveKey="1"
            items={items}
            type="card"
            size="small"
            onChange={onChange}
            style={{ height: '100%' }}
            className="tabs-wrapper"
        />
    );
};

export default index;
