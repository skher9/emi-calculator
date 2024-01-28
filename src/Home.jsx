import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { tenureData } from "./Utils/Constant";
import { numberWithCommas } from "./Utils/Config";

const Container = styled.div`
  font-family: Poppins;
`;

const Header = styled.div`
  text-align: center;
`;

const Wrapper = styled.div``;

const Title = styled.span`
  font-size: 40px;
  margin-top: 20px;
  font-weight: 1000;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  padding: 0 15px;
  gap: 20px;
  font-family: poppins;
`;

const Span = styled.span`
  margin-top: 15px;
  font-size: 23px;
  font-weight: 1000;
`;

const Input = styled.input`
  height: 30px;
`;

const InfoContainer = styled.div`
  margin-top: 30px;
  margin-left: 30px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const TenureContainer = styled.div`
  margin-bottom: 50px;
`;

const SliderWrapper = styled.div``;

const LablesContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.label``;

const B = styled.b``;

const Button = styled.button`
  width: 15%;
  height: 50px;
  border: none;
  margin-left: 20px;
  border-radius: 100px;
  background-color: rgb(226, 226, 226);
`;

const Home = () => {
  const [cost, setcost] = useState(0);
  const [interest, setinterest] = useState(0);
  const [fee, setfee] = useState(0);
  const [downpayment, setdownpayment] = useState(0);
  const [tenure, settenure] = useState(0);
  const [emi, setemi] = useState(0);

  const calculateEMI = (downpayment) => {
    if (!cost) return;

    const loanAmt = cost - downpayment;
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;

    const EMI =
      (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
      ((1 + rateOfInterest) ** numOfYears - 1);

    return Number(EMI / 12).toFixed(0);
  };

  const calculateDP = (emi) => {
    if (!cost) return;

    const downPaymentPercent = 100 - (emi / calculateEMI(0)) * 100;
    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };

  const updateEMI = (e) => {
    if (!cost) return;

    const dp = Number(e.target.value);
    setdownpayment(dp.toFixed(0));

    const emi = calculateEMI(dp);
    setemi(emi);
  };

  const updateDownPayment = (e) => {
    if (!cost) return;

    const emi = Number(e.target.value);
    setemi(emi.toFixed(0));

    const dp = calculateDP(emi);
    setdownpayment(dp);
  };

  const totalDownPayment = () => {
    return numberWithCommas(
      (Number(downpayment) + (cost - downpayment) * (fee / 100)).toFixed(0)
    );
  };

  const totalEMI = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };

  useEffect(() => {
    if (!(cost > 0)) {
      setdownpayment(0);
      setemi(0);
    }

    const emi = calculateEMI(downpayment);
    setemi(emi);
  }, [cost, downpayment]);

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>EMI CALCULATOR</Title>
        </Header>

        <InfoContainer>
          <InputContainer>
            <Span>Total Cost of Asset</Span>
            <Input
              type="number"
              value={cost || ""}
              onChange={(e) => setcost(e.target.value)}
              placeholder="Total Cost of Asset"
            />
          </InputContainer>
          <InputContainer>
            <Span>Interest Rate (in %)</Span>
            <Input
              type="number"
              value={interest || ""}
              onChange={(e) => setinterest(e.target.value)}
              placeholder="Total Cost of Asset"
            />
          </InputContainer>
          <InputContainer>
            <Span>Processing Fee (in %)</Span>
            <Input
              type="number"
              value={fee || ""}
              onChange={(e) => setfee(e.target.value)}
              placeholder="Total Cost of Asset"
            />

            <SliderContainer>
              <Span>Down Payment</Span>
              {downpayment > 0 && (
                <Span className="title" style={{ textDecoration: "underline" }}>
                  {"Total Down Payment-" + totalDownPayment()}
                </Span>
              )}
              <SliderWrapper>
                <Input
                  type="range"
                  min={0}
                  max={cost}
                  value={downpayment}
                  onChange={updateEMI}
                />
                <LablesContainer>
                  <Label>{"0%" ?? numberWithCommas(0)}</Label>
                  <B>{numberWithCommas(downpayment)}</B>
                  <Label>{"100%" ?? numberWithCommas(cost)}</Label>
                </LablesContainer>
              </SliderWrapper>
            </SliderContainer>

            <SliderContainer>
              <Span>Loan Per Month</Span>
              {downpayment > 0 && (
                <Span className="title" style={{ textDecoration: "underline" }}>
                  {"Total Loan Amount-" + totalEMI()}
                </Span>
              )}
              <SliderWrapper>
                <Input
                  type="range"
                  min={calculateEMI(cost)}
                  max={calculateEMI(0)}
                  value={emi}
                  onChange={updateDownPayment}
                />
                <LablesContainer>
                  <Label>
                    {calculateEMI(cost) ?? numberWithCommas(calculateEMI(cost))}
                  </Label>
                  <B>{numberWithCommas(emi)}</B>
                  <Label>
                    {calculateEMI(0) ?? numberWithCommas(calculateEMI(0))}
                  </Label>
                </LablesContainer>
              </SliderWrapper>
            </SliderContainer>

            <Span className="title">Tenure</Span>
            <TenureContainer>
              {tenureData.map((t) => {
                return (
                  <Button
                    className={`tenure ${t === tenure ? "selected" : ""}`}
                    onClick={() => settenure(t)}
                  >
                    {t}
                  </Button>
                );
              })}
            </TenureContainer>
          </InputContainer>
        </InfoContainer>
      </Wrapper>
    </Container>
  );
};

export default Home;
