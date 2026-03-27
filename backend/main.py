from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class TransactionStatus(str, Enum):
    normal = "normal"
    fraud = "fraud"


class Transaction(BaseModel):
    id: str
    senderId: str
    receiverId: str
    amount: float
    location: str
    deviceId: str
    ipAddress: str
    timestamp: datetime
    status: TransactionStatus
    riskScore: int = Field(ge=0, le=100)


class RiskFactorSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class RiskFactor(BaseModel):
    factor: str
    severity: RiskFactorSeverity
    score: int


class NetworkNode(BaseModel):
    id: str
    x: float
    y: float
    type: Literal["account", "device", "ip"]
    isFraud: bool
    label: str


class NetworkEdge(BaseModel):
    from_: str = Field(alias="from")
    to: str
    type: Literal["transaction", "shared_device", "shared_ip"]
    isSuspicious: bool


class NetworkGraph(BaseModel):
    nodes: list[NetworkNode]
    edges: list[NetworkEdge]


app = FastAPI(title="Guardian AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _seed_transactions() -> list[Transaction]:
    return [
        Transaction(
            id="TXN-001",
            senderId="ACC-1234",
            receiverId="ACC-5678",
            amount=1500,
            location="New York, US",
            deviceId="DEV-A1B2",
            ipAddress="192.168.1.1",
            timestamp=datetime(2024, 1, 15, 10, 30, tzinfo=timezone.utc),
            status=TransactionStatus.normal,
            riskScore=15,
        ),
        Transaction(
            id="TXN-002",
            senderId="ACC-9012",
            receiverId="ACC-3456",
            amount=25000,
            location="Lagos, NG",
            deviceId="DEV-C3D4",
            ipAddress="10.0.0.55",
            timestamp=datetime(2024, 1, 15, 11, 45, tzinfo=timezone.utc),
            status=TransactionStatus.fraud,
            riskScore=92,
        ),
        Transaction(
            id="TXN-003",
            senderId="ACC-7890",
            receiverId="ACC-1234",
            amount=3200,
            location="London, UK",
            deviceId="DEV-E5F6",
            ipAddress="172.16.0.12",
            timestamp=datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc),
            status=TransactionStatus.normal,
            riskScore=22,
        ),
        Transaction(
            id="TXN-004",
            senderId="ACC-3456",
            receiverId="ACC-9012",
            amount=8500,
            location="Moscow, RU",
            deviceId="DEV-C3D4",
            ipAddress="10.0.0.55",
            timestamp=datetime(2024, 1, 15, 13, 15, tzinfo=timezone.utc),
            status=TransactionStatus.fraud,
            riskScore=88,
        ),
        Transaction(
            id="TXN-005",
            senderId="ACC-5678",
            receiverId="ACC-7890",
            amount=450,
            location="Tokyo, JP",
            deviceId="DEV-G7H8",
            ipAddress="192.168.2.100",
            timestamp=datetime(2024, 1, 15, 14, 30, tzinfo=timezone.utc),
            status=TransactionStatus.normal,
            riskScore=8,
        ),
    ]


_TRANSACTIONS: list[Transaction] = _seed_transactions()

_RISK_FACTORS: list[RiskFactor] = [
    RiskFactor(factor="Linked to known fraud accounts", severity=RiskFactorSeverity.high, score=35),
    RiskFactor(factor="Abnormal transaction amount", severity=RiskFactorSeverity.medium, score=20),
    RiskFactor(factor="Location mismatch detected", severity=RiskFactorSeverity.high, score=25),
    RiskFactor(factor="Device/IP reuse from flagged transactions", severity=RiskFactorSeverity.high, score=30),
    RiskFactor(factor="Multiple failed attempts", severity=RiskFactorSeverity.low, score=10),
]

_NETWORK_GRAPH = NetworkGraph(
    nodes=[
        NetworkNode(id="ACC-1234", x=20, y=30, type="account", isFraud=False, label="ACC-1234"),
        NetworkNode(id="ACC-5678", x=50, y=20, type="account", isFraud=False, label="ACC-5678"),
        NetworkNode(id="ACC-9012", x=80, y=35, type="account", isFraud=True, label="ACC-9012"),
        NetworkNode(id="ACC-3456", x=70, y=60, type="account", isFraud=True, label="ACC-3456"),
        NetworkNode(id="ACC-7890", x=30, y=65, type="account", isFraud=False, label="ACC-7890"),
        NetworkNode(id="DEV-C3D4", x=75, y=45, type="device", isFraud=False, label="DEV-C3D4"),
        NetworkNode(id="IP-10.0.0.55", x=85, y=70, type="ip", isFraud=False, label="10.0.0.55"),
    ],
    edges=[
        NetworkEdge(**{"from": "ACC-1234"}, to="ACC-5678", type="transaction", isSuspicious=False),
        NetworkEdge(**{"from": "ACC-9012"}, to="ACC-3456", type="transaction", isSuspicious=True),
        NetworkEdge(**{"from": "ACC-7890"}, to="ACC-1234", type="transaction", isSuspicious=False),
        NetworkEdge(**{"from": "ACC-3456"}, to="ACC-9012", type="transaction", isSuspicious=True),
        NetworkEdge(**{"from": "ACC-5678"}, to="ACC-7890", type="transaction", isSuspicious=False),
        NetworkEdge(**{"from": "ACC-9012"}, to="DEV-C3D4", type="shared_device", isSuspicious=True),
        NetworkEdge(**{"from": "ACC-3456"}, to="DEV-C3D4", type="shared_device", isSuspicious=True),
        NetworkEdge(**{"from": "ACC-9012"}, to="IP-10.0.0.55", type="shared_ip", isSuspicious=True),
        NetworkEdge(**{"from": "ACC-3456"}, to="IP-10.0.0.55", type="shared_ip", isSuspicious=True),
    ],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/transactions", response_model=list[Transaction])
def list_transactions() -> list[Transaction]:
    return _TRANSACTIONS


@app.get("/api/risk-factors", response_model=list[RiskFactor])
def list_risk_factors() -> list[RiskFactor]:
    return _RISK_FACTORS


@app.get("/api/network-graph", response_model=NetworkGraph)
def get_network_graph() -> NetworkGraph:
    return _NETWORK_GRAPH
