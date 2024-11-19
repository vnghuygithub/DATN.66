import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getProjectList, getProjectTaskList } from '@/api/project/project.api';
import { IProject, IProjectArgs, IProjectTask, IProjectTaskArgs } from '@/interface/project/project';


const ProjectManagment = () => {
    const [projects, setProjects] = useState<any>([]);
    const [tasks, setTasks] = useState<any>([]);
    const [expandedRows, setExpandedRows] = useState<any>([]);
    const initialProjectArgs = {
        page_size: 10,
        page: 1,
        name: '',
    }
    const initialProjectTaskArgs = {
        stage_id: "",
        name: "",
        page_size: 10,
        page: 1,
    }
    useEffect(() => {
        let isMounted = true;
        const fetchProjects = async (args: any) => {
            const projectData = await getProjectList(args);
            if (isMounted && projectData?.results) {
                setProjects(projectData.results);
            }
        };
        const fetchTasks = async (args: any) => {
            const taskData = await getProjectTaskList(args);
            if (isMounted && taskData?.results) {
                setTasks(taskData.results);
            }
        };
        fetchProjects(initialProjectArgs);
        fetchTasks(initialProjectTaskArgs);
        return () => {
            isMounted = false;
        };
    }, []);

    const columns = [
        {
            title: 'Dự án',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Danh mục công việc',
            dataIndex: 'taskName',
            key: 'taskName',
        },
        {
            title: "Ngày giao việc",
            dataIndex: "date_assign",
            key: "date_assign",
        },
        {
            title: "Deadline",
            dataIndex: "date_deadline",
            key: "date_deadline",
        },
        {
            title: "Trạng thái",
            dataIndex: "stage_name",
            key: "stage_name",
        },
    ];


    const processData = () => {
        const data: any = [];
        projects.forEach((project: any) => {
            data.push({
                key: project.id,
                name: project.name,
                taskName: '',
            });

            const projectTasks = tasks.filter((task: any) => task.project_id === project.id);
            data.push(...projectTasks.map((task: any) => (
                {
                    key: task.id,
                    taskName: task.name,
                    date_assign: task.date_assign,
                    date_deadline: task.date_deadline,
                    percentage_of_completion: task.percentage_of_completion,
                    stage_name: task.stage_id[1],
                }
            )
            )
            );
        });
        return data;
    };

    const onRowExpand = (expanded: any, record: any) => {
        if (expanded) {
            setExpandedRows([...expandedRows, record.key]);
        } else {
            setExpandedRows(expandedRows.filter((key: any) => key !== record.key));
        }
    };

    const isRowExpandable = (record: any) => {
        return !!tasks.find((task: any) => task.project_id === record.key);
    };

    return (
        <Table
            loading={!projects.length && !tasks.length}
            columns={columns}
            dataSource={processData()}
            expandable={{
                expandedRowKeys: expandedRows,
                onExpand: onRowExpand,
                rowExpandable: isRowExpandable,
            }}
            bordered
            pagination={false}
        />
    );
};

export default ProjectManagment;
