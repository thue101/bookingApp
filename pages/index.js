import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Title>Welcome to Passion Wheels</Title>
      <Paragraph>
        "Your journey begins here! Stay motivated and keep moving forward."
      </Paragraph>
    </div>
  );
}
