public class LoggingMiddleware
{
    private readonly RequestDelegate _next;

    public LoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // before controller
        Console.WriteLine($"[IN] {context.Request.Method} {context.Request.Path}");

        await _next(context); // pass request down the pipeline

        // after controller responds
        Console.WriteLine($"[OUT] {context.Response.StatusCode}");
    }
}