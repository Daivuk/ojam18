// Define input vertex buffer format
// Order is important, Input Layout will be built from this.
input float2 inPosition;
input float2 inUV;
input float4 inColor;

// Define output elements that will be passed to the pixel shader
output float2 outUV;
output float4 outColor;

// Define uniforms.
extern float wind;

void main()
{
    float2 screenPosition = inPosition;

    if (inPosition.y < 0.0)
    {
        float windPercent = 1.0 - inUV.y;
        screenPosition.x += sin(wind + screenPosition.x / 30.0) * 1.0 * windPercent;
    }

    // oPosition is the output position of the shader.
    // oViewProjection is a default constant buffer that is always there for all shaders
    oPosition = mul(float4(screenPosition, 0.0, 1.0), oViewProjection);

    outUV = inUV;
    outColor = inColor;
}
