/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState,useEffect } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Upload,
  Avatar,
  message,
  Button,
  Timeline,
  Radio,
  Table
} from "antd";
import ava1 from "../assets/images/logo-shopify.svg";
import ava2 from "../assets/images/logo-atlassian.svg";
import ava3 from "../assets/images/logo-slack.svg";
import ava5 from "../assets/images/logo-jira.svg";
import ava6 from "../assets/images/logo-invision.svg";
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";

import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import { useAuth } from "../providers/AuthProvider";
import AuthAxios from "../config/AuthAxios";
function Home() {
  const { Title, Text } = Typography;

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [reverse, setReverse] = useState(false);
   
  const dollor = [  
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z"
        fill="#fff"
      ></path>
      <path
        d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z"
        fill="#fff"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const profile = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
        fill="#fff"
      ></path>
      <path
        d="M17 6C17 7.65685 15.6569 9 14 9C12.3431 9 11 7.65685 11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6Z"
        fill="#fff"
      ></path>
      <path
        d="M12.9291 17C12.9758 16.6734 13 16.3395 13 16C13 14.3648 12.4393 12.8606 11.4998 11.6691C12.2352 11.2435 13.0892 11 14 11C16.7614 11 19 13.2386 19 16V17H12.9291Z"
        fill="#fff"
      ></path>
      <path
        d="M6 11C8.76142 11 11 13.2386 11 16V17H1V16C1 13.2386 3.23858 11 6 11Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const heart = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const cart = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C7.79086 2 6 3.79086 6 6V7H5C4.49046 7 4.06239 7.38314 4.00612 7.88957L3.00612 16.8896C2.97471 17.1723 3.06518 17.455 3.25488 17.6669C3.44458 17.8789 3.71556 18 4 18H16C16.2844 18 16.5554 17.8789 16.7451 17.6669C16.9348 17.455 17.0253 17.1723 16.9939 16.8896L15.9939 7.88957C15.9376 7.38314 15.5096 7 15 7H14V6C14 3.79086 12.2091 2 10 2ZM12 7V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V7H12ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10ZM13 9C12.4477 9 12 9.44772 12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9Z"
        fill="#fff"
      ></path>
    </svg>,
  ];

  const list = [
    {
      img: ava1,
      Title: "Soft UI Shopify Version",
      bud: "$14,000",
      progress: <Progress percent={60} size="small" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Alexander Smith">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Jessica Doe">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: ava2,
      Title: "Progress Track",
      bud: "$3,000",
      progress: <Progress percent={10} size="small" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: ava3,
      Title: "Fix Platform Errors",
      bud: "Not Set",
      progress: <Progress percent={100} size="small" status="active" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Alexander Smith">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: '',
      Title: "Launch new Mobile App",
      bud: "$20,600",
      progress: <Progress percent={100} size="small" status="active" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: ava5,
      Title: "Add the New Landing Page",
      bud: "$4,000",
      progress: <Progress percent={80} size="small" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Alexander Smith">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Jessica Doe">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
        </div>
      ),
    },

    {
      img: ava6,
      Title: "Redesign Online Store",
      bud: "$2,000",
      progress: (
        <Progress
          percent={100}
          size="small"
          status="exception"
          format={() => "Cancel"}
        />
      ),
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={''} alt="" />
          </Tooltip>
        </div>
      ),
    },
  ];

  const timelineList = [
    {
      title: "$2,400 - Redesign store",
      time: "09 JUN 7:20 PM",
      color: "green",
    },
    {
      title: "New order #3654323",
      time: "08 JUN 12:20 PM",
      color: "green",
    },
    {
      title: "Company server payments",
      time: "04 JUN 3:10 PM",
    },
    {
      title: "New card added for order #4826321",
      time: "02 JUN 2:45 PM",
    },
    {
      title: "Unlock folders for development",
      time: "18 MAY 1:30 PM",
    },
    {
      title: "New order #46282344",
      time: "14 MAY 3:30 PM",
      color: "gray",
    },
  ];

  const uploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const [topData, setTopData] = useState([]);
  const [bottomData, setBottomData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaffs, setTotalStaffs] = useState(0);
  
    const [todayStudent, setTodayStudent] = useState(0);
    const [todayStaff, setTodayStaff] = useState(0);
    const [arrayCount,setArrayCount] = useState([]);

  const [staffOverall, setStaffOverall] = useState(null);
  const [studentOverall, setStudentOverall] = useState(null);

  const [staffSessions, setStaffSession] = useState(null);
  const [studentSessions, setStudentSession] = useState([]);


  const [studentLimit, setStudentLimit] = useState(5);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
// table code start
const columns = [
  {
    title: <h3 className="column-header">NAME</h3>,
    dataIndex: "name",
    key: "name",
  },
  {
    title: <h3 className="column-header">STANDARD</h3>,
    dataIndex: "Standard",
    key: "Standard",
  },
  {
    title: <h3 className="column-header">MEDIUM</h3>,
    key: "Medium",
    dataIndex: "Medium",
  },
  {
    title: <h3 className="column-header">PARENTS NAME</h3>,
    key: "parent",
    dataIndex: "parent",
  },
  {
    title: <h3 className="column-header">PARENTS PHONE</h3>,
    key: "parentphone",
    dataIndex: "parentphone",
  },
  {
    title: <h3 className="column-header">ATTENDENCE</h3>,
    key: "attendance",
    dataIndex: "attendance",
  },
  {
    title: <h3 className="column-header">PERCENTAGE</h3>,
    key: "Percentage",
    dataIndex: "Percentage",
  },
];



const Topdatas = topData.map((data, index) => ({
  key: index.toString(),
  name: (
    <>
     
        <div className="avatar-info">
        <b><span >{data.first_name}&nbsp;{data.last_name}</span></b>
        </div>
    </>
  ),

  Standard: (
    <>
      <div className="ant-employed">
          <span>{data.class.class_name}</span>
        </div>
    </>
  ),
  Medium: (
    <>
      <div className="ant-employed">
        <span>{data.medium.type}</span>
      </div>
    </>
  ),
  parent: (
    <>
      <div className="ant-employed">
        <span>{data.parent_name}</span>
      </div>
    </>
  ),
  parentphone: (
    <>
      <div className="ant-employed">
        <span>{data.parent_phone}</span>
      </div>
    </>
  ),
  attendence: (
    <>
      <div className="ant-employed">
        <span>{data.total_attendance + '/' + ( parseInt(data?.date_span) - parseInt(data?.total_leaves))}</span>
      </div>
    </>
  ),
  Percentage: (
    <>
      <div className="ant-employed">
        <span>{data?.student_percentage
                  ? parseFloat(data.student_percentage).toFixed(2) + '%'
                  : ""}</span>
      </div>
    </>
  ),
}));
const bottomdatas = bottomData.map((data, index) => ({
  key: index.toString(),
  name: (
    <>
     
     <div className="avatar-info">
          <b><span >{data.first_name}&nbsp;{data.last_name}</span></b>
        </div>
    </>
  ),

  Standard: (
    <>
      <div className="ant-employed">
          <span>{data.class.class_name}</span>
        </div>
    </>
  ),
  Medium: (
    <>
      <div className="ant-employed">
        <span>{data.medium.type}</span>
      </div>
    </>
  ),
  parent: (
    <>
      <div className="ant-employed">
        <span>{data.parent_name}</span>
      </div>
    </>
  ),
  parentphone: (
    <>
      <div className="ant-employed">
        <span>{data.parent_phone}</span>
      </div>
    </>
  ),
  attendence: (
    <>
      <div className="ant-employed">
        <span>{data.total_attendance + '/' + ( parseInt(data?.date_span) - parseInt(data?.total_leaves))}</span>
      </div>
    </>
  ),
  Percentage: (
    <>
      <div className="ant-employed">
        <span>{data?.student_percentage
                  ? parseFloat(data.student_percentage).toFixed(2) + '%'
                  : ""}</span>
      </div>
    </>
  ),
}));

// Now 'datas' contains the transformed data based on 'topData' with keys using the map function.


  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await api.get("getstudentscount/", {});
        setTotalStudents(students.data.studentCount);
  
        const staffs = await api.get("getstaffscount/", {});
        setTotalStaffs(staffs.data.staffCount);
  
        const todayStudentAttendance = await api.get("todaystudentattendance/", {});
        setTodayStudent(todayStudentAttendance.data.count);
  
        const todayStaffAttendance = await api.get("todaystaffattendance/", {});
        setTodayStaff(todayStaffAttendance.data.count);
        
        // Set the count array once all data is fetched and state is updated
        const count = [
          {
            today: "Total Students",
            title: students.data.studentCount,
            persent: "",
            icon: profile,
            bnb: "bnb2",
          },
          {
            today: "Total Staffs",
            title: staffs.data.staffCount,
            persent: "",
            icon: profile,
            bnb: "bnb2",
          },
          {
            today: "Students Present Today",
            title: todayStudentAttendance.data.count,
            persent: "",
            icon: profile,
            bnb: "redtext",
          },
          {
            today: "Staffs Present Today",
            title: todayStaffAttendance.data.count,
            persent: "",
            icon: profile,
            bnb: "bnb2",
          },
        ];
        setArrayCount(count);

        await api
        .get("studentssessionpercentage/", {})
        .then(async (students) => {
          console.log(students.data);
          let data = students?.data;
          let chartData = await Promise.all(data.map((value, i) => {
            return { name: value.monthName, Total: parseFloat(value.overallAveragePercentage).toFixed(2)}
          }));
          setStudentSession(chartData);
        })
  
        .catch((error) => {
          console.error("Error", error);
          console.error("Error fetching data:", error?.response?.data);
        });
        await api
        .get("studentspercentage/", {
          params: {
            limit: studentLimit,
            order: "top",
          },
        })
        .then((students) => {
          console.log('hellos',students.data);
          setTopData(students.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error?.response?.data);
        });
        await api
        .get("studentspercentage/", {
          params: {
            limit: studentLimit,
            order: "bottom",
          },
        })
        .then((students) => {
          setBottomData(students.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error?.response?.data);
        });
  
      } catch (error) {
        console.error("Error fetching data:", error?.response?.data);
      }
    };
  
    fetchData();
  }, []);
  
  
  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {arrayCount.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24" 
            >
              <Card bordered={false} className="criclebox" style={{ padding: 0, height: '90px',  marginTop:-10}}>
                <div className="number" style={{marginTop:-12}}>
                  <Row align="middle" gutter={[, 0]}>
                    <Col xs={19}>
                      <span>{c.today}</span>
                      <Title level={2}>
                        {c.title} <small className={c.bnb}>{c.persent}</small>
                      </Title>
                    </Col>
                    <Col xs={3}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]}>
     
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
  <Card bordered={false} className="criclebox h-full">
    {studentSessions.length > 0 && (
      <LineChart data={studentSessions} title="This Session (Attendance)" />
    )}
  </Card>
</Col>

        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Top 5 Students"
              extra={
                <>
                 
                </>
              }
            >
              <div className="table-responsive">
                <Table style={{textAlign:"left" }}
                  columns={columns}
                  dataSource={Topdatas}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
          <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Bottom 5 Students"
              extra={
                <>
                 
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={bottomdatas}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
        {/* <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>Projects</Title>
                  <Paragraph className="lastweek">
                    done this month<span className="blue">40%</span>
                  </Paragraph>
                </div>
                <div className="ant-filtertabs">
                  <div className="antd-pro-pages-dashboard-analysis-style-salesExtra">
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="a">ALL</Radio.Button>
                      <Radio.Button value="b">ONLINE</Radio.Button>
                      <Radio.Button value="c">STORES</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
                <table className="width-100">
                  <thead>
                    <tr>
                      <th>COMPANIES</th>
                      <th>MEMBERS</th>
                      <th>BUDGET</th>
                      <th>COMPLETION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((d, index) => (
                      <tr key={index}>
                        <td>
                          <h6>
                            <img
                              src={d.img}
                              alt=""
                              className="avatar-sm mr-10"
                            />{" "}
                            {d.Title}
                          </h6>
                        </td>
                        <td>{d.member}</td>
                        <td>
                          <span className="text-xs font-weight-bold">
                            {d.bud}{" "}
                          </span>
                        </td>
                        <td>
                          <div className="percent-progress">{d.progress}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="uploadfile shadow-none">
                <Upload {...uploadProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    <span className="click">Click to Upload</span>
                  </Button>
                </Upload>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="timeline-box">
                <Title level={5}>Orders History</Title>
                <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                  this month <span className="bnb2">20%</span>
                </Paragraph>

                <Timeline
                  pending="Recording..."
                  className="timelinelist"
                  reverse={reverse}
                >
                  {timelineList.map((t, index) => (
                    <Timeline.Item color={t.color} key={index}>
                      <Title level={5}>{t.title}</Title>
                      <Text>{t.time}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
                <Button
                  type="primary"
                  className="width-100"
                  onClick={() => setReverse(!reverse)}
                >
                  {<MenuUnfoldOutlined />} REVERSE
                </Button>
              </div>
            </Card>
          </Col>
        </Row> */}

        {/* <Row gutter={[24, 0]}>
          <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Row gutter>
                <Col
                  xs={24}
                  md={12}
                  sm={24}
                  lg={12}
                  xl={14}
                  className="mobile-24"
                >
                  <div className="h-full col-content p-20">
                    <div className="ant-muse">
                      <Text>Built by developers</Text>
                      <Title level={5}>Muse Dashboard for Ant Design</Title>
                      <Paragraph className="lastweek mb-36">
                        From colors, cards, typography to complex elements, you
                        will find the full documentation.
                      </Paragraph>
                    </div>
                    <div className="card-footer">
                      <a className="icon-move-right" href="#pablo">
                        Read More
                        {<RightOutlined />}
                      </a>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={24}
                  md={12}
                  sm={24}
                  lg={12}
                  xl={10}
                  className="col-img"
                >
                  <div className="ant-cret text-right">
                    <img src={''} alt="" className="border10" />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox card-info-2 h-full">
              <div className="gradent h-full col-content">
                <div className="card-content">
                  <Title level={5}>Work with the best</Title>
                  <p>
                    Wealth creation is an evolutionarily recent positive-sum
                    game. It is all about who take the opportunity first.
                  </p>
                </div>
                <div className="card-footer">
                  <a className="icon-move-right" href="#pablo">
                    Read More
                    <RightOutlined />
                  </a>
                </div>
              </div>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default Home;
