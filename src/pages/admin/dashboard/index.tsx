import { BookOutlined, DollarCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const barData = [
        { name: "Fiction", books: 40 },
        { name: "Non-Fiction", books: 30 },
        { name: "Science", books: 20 },
        { name: "Math", books: 10 },
    ];

    const pieData = [
        { name: "Sold", value: 70 },
        { name: "In Stock", value: 30 },
    ];

    const lineData = [
        { month: "Jan", sales: 30 },
        { month: "Feb", sales: 20 },
        { month: "Mar", sales: 50 },
        { month: "Apr", sales: 40 },
        { month: "May", sales: 60 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Users"
                            value={1200}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Books"
                            value={350}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Orders"
                            value={150}
                            prefix={<DollarCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 32 }}>
                <Col span={12}>
                    <Card title="Books by Category">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="books" fill="#1890FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Books Sold Ratio">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 32 }}>
                <Col span={24}>
                    <Card title="Monthly Sales">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
