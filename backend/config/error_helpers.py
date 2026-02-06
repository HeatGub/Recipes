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