def api_err_dict(err_code, **err_params):
    """
    Returns a structured dictionary containing the error code and parameters, if provided
    """
    if err_params:
        return {
            "err_code": err_code,
            "err_params": err_params,
        }

    return {
        "err_code": err_code,
    }

def remove_empty_list_fields(error_dict: dict):
    """Removes fields with empty error list"""
    return {k: v for k, v in error_dict.items() if v}