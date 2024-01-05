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
import { useState,useEffect,useRef } from "react";

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

import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";

// import Echart from "../components/chart/EChart";
// import LineChart from "../components/chart/LineChart";
import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";
function Home() {
  const { Title, Text } = Typography;  
  const dataRef = useRef(null)
  const [data, setData] = useState([]);
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [reverse, setReverse] = useState(false);  

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
  const Topdatas = data.map((data, index) => ({
    key: index.toString(),
    name: (
      <>
       
          <div className="avatar-info">
            <Title level={5}>{data.name}</Title>
          </div>
      </>
    ),
  
    phone: (
      <>
        <div className="ant-employed">
            <span>{data.phone}</span>
          </div>
      </>
    ),
    email: (
      <>
        <div className="ant-employed">
          <span>{data.email}</span>
        </div>
      </>
    ),
  
  }));
// table code start
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "32%",
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phone",
  },

  {
    title: "Email ",
    key: "email",
    dataIndex: "email",
  },
 
];




// Now 'datas' contains the transformed data based on 'topData' with keys using the map function.

useEffect(() => {
  api.get('parents').then((res) => {
   let data = res.data;
   setData(data)
}).catch((err) => {
   console.error(err)
})
}, []);
  
return (
  <>
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-48"
            title="Parents"
            
          >
            <br />
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="ant-border-space"
              />
            </div>
          </Card>

        </Col>
      </Row>
    </div>
  </>
);
}

export default Home;
