import io.github.jan.supabase.functions.Functions

fun test(functions: Functions) {
    functions.invoke("a") {
        this.body = "b"
    }
}
