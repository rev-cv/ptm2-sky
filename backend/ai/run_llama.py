from llama_cpp import Llama

def run_llama(prompt):
    llm = Llama(model_path="./gguf/google_gemma-3-12b-it-IQ4_XS.gguf", n_ctx=2000, verbose=False)
    output = llm(prompt, max_tokens=2000, temperature=0.7, top_p=0.9)
    return output

if __name__ == "__main__":
    print(
        run_llama("Привет")
    )