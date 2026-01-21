from rest_framework.response import Response
from rest_framework import status

def api_response(
    *,
    success: bool,
    code: str, # GLOBAL LEVEL ERROR
    data=None,
    errors=None, # FIELD LEVEL
    message=None,
    meta=None,
    http_status=status.HTTP_200_OK,
):
    return Response(
        {
            "success": success,
            "code": code,
            "message": message,
            "data": {} if data is None else data,
            "errors": {} if errors is None else errors,
            "meta": {} if meta is None else meta,
        },
        status=http_status,
    )
