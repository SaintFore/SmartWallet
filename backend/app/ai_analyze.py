import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END
from .models import TransactionInfo, AgentState
from datetime import datetime
from typing import cast

load_dotenv()


def api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    assert api_key is not None, "没有api"
    return api_key


llm = ChatOpenAI(
    model="gpt-5-nano",
    api_key=api_key,
    # base_url=os.getenv("DEEPSEEK_BASE_URL"),
    temperature=0,
)

structured_llm = llm.with_structured_output(TransactionInfo)


def extractor_node(state: AgentState):
    input_text = state.input_text
    current_date = datetime.now().strftime("%Y-%m-%d")

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                f"你是一个记账助手，当前日期是{current_date}。请从用户提供的文本中提取交易信息",
            ),
            ("human", f"{input_text}"),
        ]
    )

    chain = prompt | structured_llm

    try:
        result = chain.invoke({"input_text": input_text, "current_date": current_date})
        return {"parsed_result": result}

    except Exception as e:
        print(f"Error in extractor_node: {e}")
        return {"parsed_result": None}


workflow = StateGraph(AgentState)
workflow.add_node("extractor", extractor_node)
workflow.set_entry_point("extractor")
workflow.add_edge("extractor", END)

app_graph = workflow.compile()


def analyze_text_with_graph(input_text: str) -> TransactionInfo | None:
    state = AgentState(input_text=input_text)
    result = app_graph.invoke(state)
    parsed = result.get("parsed_result")
    return cast(TransactionInfo | None, parsed)
