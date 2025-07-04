// src/api/auth.js
const API_BASE_URL = 'https://localhost:5026';

export async function loginUser(email, password) {
  const RADENDPOINT_LOGIN_URL = `${API_BASE_URL}/identity/login`;

  try {
    const response = await fetch(RADENDPOINT_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Login Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Login failed: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Login successful!',
        token: data?.accessToken,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Login failed. Please check credentials.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during login call:', error);
    return {
      success: false,
      message: 'Network error. Could not connect to the login server. Ensure it is running and accessible.'
    };
  }
}

export async function validateToken(token) {
  const RADENDPOINT_VALIDATE_TOKEN_URL = `${API_BASE_URL}/identity/validate-token`;

  if (!token) {
    return { success: false, message: "No token provided for validation." };
  }

  try {
    const response = await fetch(RADENDPOINT_VALIDATE_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Token validation succeeded but response was not valid JSON: ${parseError.message}` };
            }
        } else {
            return { success: true, message: "Token validated successfully (empty response)." };
        }
    } else {
      let errorMessage = `Token validation failed with status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during token validation call:', error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the validation server.'}` };
  }
}

export async function registerUser(email, password) {
  const RADENDPOINT_REGISTER_URL = `${API_BASE_URL}/identity/register`;

  try {
    const response = await fetch(RADENDPOINT_REGISTER_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Register User Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Registration failed: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Registration successful!',
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Registration failed.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during registration call:', error);
    return {
      success: false,
      message: 'Network error. Could not connect to the registration server. Ensure it is running and accessible.'
    };
  }
}

export async function getCustomers(token) {
  const CUSTOMERS_API_URL = `${API_BASE_URL}/api/customer`;
  console.log('API: Fetching customers with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CUSTOMERS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse customers data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch customers: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch customers. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during customers call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the customers server.'}`
    };
  }
}

export async function getCustomerById(token, customerId) {
  const CUSTOMER_BY_ID_API_URL = `${API_BASE_URL}/api/customer/${customerId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!customerId) {
    return { success: false, message: "No customer ID provided." };
  }

  try {
    const response = await fetch(CUSTOMER_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse customer data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch customer: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch customer with ID ${customerId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get customer by ID (${customerId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the customer server.'}` };
  }
}

export async function createCustomer(authToken, customerData) {
  const CUSTOMERS_API_URL = `${API_BASE_URL}/api/customer`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CUSTOMERS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(customerData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Customer created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Customer Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create customer: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Customer created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create customer.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create customer call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the customer creation server.'}`
    };
  }
}

export async function updateCustomer(token, customerId, updatedCustomerData) {
  const CUSTOMER_UPDATE_URL = `${API_BASE_URL}/api/customer/${customerId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', CUSTOMER_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedCustomerData, null, 2));

  try {
    const getResult = await getCustomerById(token, customerId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing customer for update: ${getResult.message}` };
    }
    const existingCustomer = getResult.data;

    const finalUpdatePayload = {
      ...existingCustomer,
      ...updatedCustomerData,
      id: customerId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(CUSTOMER_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Customer updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Customer Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Customer updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Customer updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update customer. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update customer call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the customer update server.'}`
    };
  }
}

export async function deleteCustomer(token, customerId) {
  const CUSTOMER_DELETE_URL = `${API_BASE_URL}/api/customer/${customerId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CUSTOMER_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Customer deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Customer Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Customer deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Customer deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete customer. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete customer call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the customer delete server.'}`
    };
  }
}
export async function getAddresses(token) {
  const ADDRESSES_API_URL = `${API_BASE_URL}/api/address`;
  console.log('API: Fetching addresses with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(ADDRESSES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse addresses data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch addresses: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch addresses. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during addresses call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the addresses server.'}`
    };
  }
}

export async function getAddresById(token, addresId) {
  const ADDRES_BY_ID_API_URL = `${API_BASE_URL}/api/address/${addresId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!addresId) {
    return { success: false, message: "No addres ID provided." };
  }

  try {
    const response = await fetch(ADDRES_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse addres data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch addres: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch addres with ID ${addresId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get addres by ID (${addresId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the addres server.'}` };
  }
}

export async function createAddres(authToken, addresData) {
  const ADDRESSES_API_URL = `${API_BASE_URL}/api/address`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(ADDRESSES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(addresData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Addres created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Addres Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create addres: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Addres created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create addres.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create addres call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the addres creation server.'}`
    };
  }
}

export async function updateAddres(token, addresId, updatedAddresData) {
  const ADDRES_UPDATE_URL = `${API_BASE_URL}/api/address/${addresId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', ADDRES_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedAddresData, null, 2));

  try {
    const getResult = await getAddresById(token, addresId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing addres for update: ${getResult.message}` };
    }
    const existingAddres = getResult.data;

    const finalUpdatePayload = {
      ...existingAddres,
      ...updatedAddresData,
      id: addresId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(ADDRES_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Addres updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Addres Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Addres updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Addres updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update addres. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update addres call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the addres update server.'}`
    };
  }
}

export async function deleteAddres(token, addresId) {
  const ADDRES_DELETE_URL = `${API_BASE_URL}/api/address/${addresId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(ADDRES_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Addres deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Addres Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Addres deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Addres deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete addres. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete addres call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the addres delete server.'}`
    };
  }
}
export async function getProductCategories(token) {
  const PRODUCT_CATEGORIES_API_URL = `${API_BASE_URL}/api/productcategory`;
  console.log('API: Fetching product categories with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(PRODUCT_CATEGORIES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse product categories data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch product categories: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch product categories. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during product categories call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product categories server.'}`
    };
  }
}

export async function getProductCategoryById(token, productCategoryId) {
  const PRODUCT_CATEGORY_BY_ID_API_URL = `${API_BASE_URL}/api/productcategory/${productCategoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!productCategoryId) {
    return { success: false, message: "No product category ID provided." };
  }

  try {
    const response = await fetch(PRODUCT_CATEGORY_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse product category data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch product category: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch product category with ID ${productCategoryId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get product category by ID (${productCategoryId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the product category server.'}` };
  }
}

export async function createProductCategory(authToken, productCategoryData) {
  const PRODUCT_CATEGORIES_API_URL = `${API_BASE_URL}/api/productcategory`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(PRODUCT_CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(productCategoryData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Product category created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Product Category Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create product category: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Product category created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create product category.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create product category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product category creation server.'}`
    };
  }
}

export async function updateProductCategory(token, productCategoryId, updatedProductCategoryData) {
  const PRODUCT_CATEGORY_UPDATE_URL = `${API_BASE_URL}/api/productcategory/${productCategoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', PRODUCT_CATEGORY_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedProductCategoryData, null, 2));

  try {
    const getResult = await getProductCategoryById(token, productCategoryId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing product category for update: ${getResult.message}` };
    }
    const existingProductCategory = getResult.data;

    const finalUpdatePayload = {
      ...existingProductCategory,
      ...updatedProductCategoryData,
      id: productCategoryId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(PRODUCT_CATEGORY_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Product category updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Product Category Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Product category updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Product category updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update product category. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update product category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product category update server.'}`
    };
  }
}

export async function deleteProductCategory(token, productCategoryId) {
  const PRODUCT_CATEGORY_DELETE_URL = `${API_BASE_URL}/api/productcategory/${productCategoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(PRODUCT_CATEGORY_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Product category deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Product Category Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Product category deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Product category deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete product category. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete product category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product category delete server.'}`
    };
  }
}
export async function getServiceCategories(token) {
  const SERVICE_CATEGORIES_API_URL = `${API_BASE_URL}/api/servicecategory`;
  console.log('API: Fetching service categories with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SERVICE_CATEGORIES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse service categories data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch service categories: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch service categories. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during service categories call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service categories server.'}`
    };
  }
}

export async function getServiceCategoryById(token, serviceCategoryId) {
  const SERVICE_CATEGORY_BY_ID_API_URL = `${API_BASE_URL}/api/servicecategory/${serviceCategoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!serviceCategoryId) {
    return { success: false, message: "No service category ID provided." };
  }

  try {
    const response = await fetch(SERVICE_CATEGORY_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse service category data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch service category: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch service category with ID ${serviceCategoryId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get service category by ID (${serviceCategoryId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the service category server.'}` };
  }
}

export async function createServiceCategory(authToken, serviceCategoryData) {
  const SERVICE_CATEGORIES_API_URL = `${API_BASE_URL}/api/servicecategory`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SERVICE_CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(serviceCategoryData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Service category created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Service Category Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create service category: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Service category created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create service category.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create service category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service category creation server.'}`
    };
  }
}

export async function updateServiceCategory(token, serviceCategoryId, updatedServiceCategoryData) {
  const SERVICE_CATEGORY_UPDATE_URL = `${API_BASE_URL}/api/servicecategory/${serviceCategoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', SERVICE_CATEGORY_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedServiceCategoryData, null, 2));

  try {
    const getResult = await getServiceCategoryById(token, serviceCategoryId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing service category for update: ${getResult.message}` };
    }
    const existingServiceCategory = getResult.data;

    const finalUpdatePayload = {
      ...existingServiceCategory,
      ...updatedServiceCategoryData,
      id: serviceCategoryId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(SERVICE_CATEGORY_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Service category updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Service Category Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Service category updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Service category updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update service category. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update service category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service category update server.'}`
    };
  }
}

export async function deleteServiceCategory(token, serviceCategoryId) {
  const SERVICE_CATEGORY_DELETE_URL = `${API_BASE_URL}/api/servicecategory/${serviceCategoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SERVICE_CATEGORY_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Service category deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Service Category Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Service category deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Service category deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete service category. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete service category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service category delete server.'}`
    };
  }
}
export async function getContacts(token) {
  const CONTACTS_API_URL = `${API_BASE_URL}/api/contact`;
  console.log('API: Fetching contacts with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CONTACTS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse contacts data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch contacts: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch contacts. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during contacts call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contacts server.'}`
    };
  }
}

export async function getContactById(token, contactId) {
  const CONTACT_BY_ID_API_URL = `${API_BASE_URL}/api/contact/${contactId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!contactId) {
    return { success: false, message: "No contact ID provided." };
  }

  try {
    const response = await fetch(CONTACT_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse contact data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch contact: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch contact with ID ${contactId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get contact by ID (${contactId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the contact server.'}` };
  }
}

export async function createContact(authToken, contactData) {
  const CONTACTS_API_URL = `${API_BASE_URL}/api/contact`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CONTACTS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(contactData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Contact created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Contact Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create contact: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Contact created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create contact.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create contact call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contact creation server.'}`
    };
  }
}

export async function updateContact(token, contactId, updatedContactData) {
  const CONTACT_UPDATE_URL = `${API_BASE_URL}/api/contact/${contactId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', CONTACT_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedContactData, null, 2));

  try {
    const getResult = await getContactById(token, contactId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing contact for update: ${getResult.message}` };
    }
    const existingContact = getResult.data;

    const finalUpdatePayload = {
      ...existingContact,
      ...updatedContactData,
      id: contactId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(CONTACT_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Contact updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Contact Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Contact updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Contact updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update contact. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update contact call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contact update server.'}`
    };
  }
}

export async function deleteContact(token, contactId) {
  const CONTACT_DELETE_URL = `${API_BASE_URL}/api/contact/${contactId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CONTACT_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Contact deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Contact Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Contact deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Contact deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete contact. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete contact call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contact delete server.'}`
    };
  }
}
export async function getOpportunities(token) {
  const OPPORTUNITIES_API_URL = `${API_BASE_URL}/api/opportunity`;
  console.log('API: Fetching opportunities with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(OPPORTUNITIES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse opportunities data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch opportunities: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch opportunities. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during opportunities call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the opportunities server.'}`
    };
  }
}

export async function getOpportunityById(token, opportunityId) {
  const OPPORTUNITY_BY_ID_API_URL = `${API_BASE_URL}/api/opportunity/${opportunityId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!opportunityId) {
    return { success: false, message: "No opportunity ID provided." };
  }

  try {
    const response = await fetch(OPPORTUNITY_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse opportunity data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch opportunity: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch opportunity with ID ${opportunityId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get opportunity by ID (${opportunityId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the opportunity server.'}` };
  }
}

export async function createOpportunity(authToken, opportunityData) {
  const OPPORTUNITIES_API_URL = `${API_BASE_URL}/api/opportunity`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(OPPORTUNITIES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(opportunityData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Opportunity created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Opportunity Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create opportunity: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Opportunity created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create opportunity.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create opportunity call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the opportunity creation server.'}`
    };
  }
}

export async function updateOpportunity(token, opportunityId, updatedOpportunityData) {
  const OPPORTUNITY_UPDATE_URL = `${API_BASE_URL}/api/opportunity/${opportunityId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', OPPORTUNITY_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedOpportunityData, null, 2));

  try {
    const getResult = await getOpportunityById(token, opportunityId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing opportunity for update: ${getResult.message}` };
    }
    const existingOpportunity = getResult.data;

    const finalUpdatePayload = {
      ...existingOpportunity,
      ...updatedOpportunityData,
      id: opportunityId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(OPPORTUNITY_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Opportunity updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Opportunity Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Opportunity updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Opportunity updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update opportunity. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update opportunity call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the opportunity update server.'}`
    };
  }
}

export async function deleteOpportunity(token, opportunityId) {
  const OPPORTUNITY_DELETE_URL = `${API_BASE_URL}/api/opportunity/${opportunityId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(OPPORTUNITY_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Opportunity deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Opportunity Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Opportunity deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Opportunity deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete opportunity. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete opportunity call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the opportunity delete server.'}`
    };
  }
}
export async function getLeads(token) {
  const LEADS_API_URL = `${API_BASE_URL}/api/lead`;
  console.log('API: Fetching leads with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(LEADS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse leads data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch leads: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch leads. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during leads call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the leads server.'}`
    };
  }
}

export async function getLeadById(token, leadId) {
  const LEAD_BY_ID_API_URL = `${API_BASE_URL}/api/lead/${leadId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!leadId) {
    return { success: false, message: "No lead ID provided." };
  }

  try {
    const response = await fetch(LEAD_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse lead data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch lead: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch lead with ID ${leadId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get lead by ID (${leadId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the lead server.'}` };
  }
}

export async function createLead(authToken, leadData) {
  const LEADS_API_URL = `${API_BASE_URL}/api/lead`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(LEADS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(leadData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Lead created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Lead Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create lead: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Lead created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create lead.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create lead call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the lead creation server.'}`
    };
  }
}

export async function updateLead(token, leadId, updatedLeadData) {
  const LEAD_UPDATE_URL = `${API_BASE_URL}/api/lead/${leadId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', LEAD_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedLeadData, null, 2));

  try {
    const getResult = await getLeadById(token, leadId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing lead for update: ${getResult.message}` };
    }
    const existingLead = getResult.data;

    const finalUpdatePayload = {
      ...existingLead,
      ...updatedLeadData,
      id: leadId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(LEAD_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Lead updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Lead Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Lead updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Lead updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update lead. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update lead call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the lead update server.'}`
    };
  }
}

export async function deleteLead(token, leadId) {
  const LEAD_DELETE_URL = `${API_BASE_URL}/api/lead/${leadId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(LEAD_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Lead deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Lead Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Lead deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Lead deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete lead. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete lead call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the lead delete server.'}`
    };
  }
}
export async function getProducts(token) {
  const PRODUCTS_API_URL = `${API_BASE_URL}/api/product`;
  console.log('API: Fetching products with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(PRODUCTS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse products data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch products: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch products. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during products call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the products server.'}`
    };
  }
}

export async function getProductById(token, productId) {
  const PRODUCT_BY_ID_API_URL = `${API_BASE_URL}/api/product/${productId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!productId) {
    return { success: false, message: "No product ID provided." };
  }

  try {
    const response = await fetch(PRODUCT_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse product data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch product: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch product with ID ${productId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get product by ID (${productId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the product server.'}` };
  }
}

export async function createProduct(authToken, productData) {
  const PRODUCTS_API_URL = `${API_BASE_URL}/api/product`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(PRODUCTS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(productData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Product created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Product Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create product: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Product created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create product.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create product call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product creation server.'}`
    };
  }
}

export async function updateProduct(token, productId, updatedProductData) {
  const PRODUCT_UPDATE_URL = `${API_BASE_URL}/api/product/${productId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', PRODUCT_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedProductData, null, 2));

  try {
    const getResult = await getProductById(token, productId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing product for update: ${getResult.message}` };
    }
    const existingProduct = getResult.data;

    const finalUpdatePayload = {
      ...existingProduct,
      ...updatedProductData,
      id: productId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(PRODUCT_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Product updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Product Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Product updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Product updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update product. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update product call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product update server.'}`
    };
  }
}

export async function deleteProduct(token, productId) {
  const PRODUCT_DELETE_URL = `${API_BASE_URL}/api/product/${productId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(PRODUCT_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Product deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Product Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Product deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Product deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete product. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete product call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the product delete server.'}`
    };
  }
}
export async function getServices(token) {
  const SERVICES_API_URL = `${API_BASE_URL}/api/service`;
  console.log('API: Fetching services with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SERVICES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse services data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch services: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch services. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during services call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the services server.'}`
    };
  }
}

export async function getServiceById(token, serviceId) {
  const SERVICE_BY_ID_API_URL = `${API_BASE_URL}/api/service/${serviceId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!serviceId) {
    return { success: false, message: "No service ID provided." };
  }

  try {
    const response = await fetch(SERVICE_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse service data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch service: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch service with ID ${serviceId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get service by ID (${serviceId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the service server.'}` };
  }
}

export async function createService(authToken, serviceData) {
  const SERVICES_API_URL = `${API_BASE_URL}/api/service`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SERVICES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Service created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Service Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create service: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Service created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create service.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create service call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service creation server.'}`
    };
  }
}

export async function updateService(token, serviceId, updatedServiceData) {
  const SERVICE_UPDATE_URL = `${API_BASE_URL}/api/service/${serviceId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', SERVICE_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedServiceData, null, 2));

  try {
    const getResult = await getServiceById(token, serviceId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing service for update: ${getResult.message}` };
    }
    const existingService = getResult.data;

    const finalUpdatePayload = {
      ...existingService,
      ...updatedServiceData,
      id: serviceId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(SERVICE_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Service updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Service Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Service updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Service updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update service. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update service call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service update server.'}`
    };
  }
}

export async function deleteService(token, serviceId) {
  const SERVICE_DELETE_URL = `${API_BASE_URL}/api/service/${serviceId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SERVICE_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Service deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Service Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Service deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Service deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete service. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete service call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the service delete server.'}`
    };
  }
}
export async function getSales(token) {
  const SALES_API_URL = `${API_BASE_URL}/api/sale`;
  console.log('API: Fetching sales with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SALES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse sales data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch sales: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch sales. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during sales call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the sales server.'}`
    };
  }
}

export async function getSaleById(token, saleId) {
  const SALE_BY_ID_API_URL = `${API_BASE_URL}/api/sale/${saleId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!saleId) {
    return { success: false, message: "No sale ID provided." };
  }

  try {
    const response = await fetch(SALE_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse sale data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch sale: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch sale with ID ${saleId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get sale by ID (${saleId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the sale server.'}` };
  }
}

export async function createSale(authToken, saleData) {
  const SALES_API_URL = `${API_BASE_URL}/api/sale`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SALES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(saleData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Sale created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Sale Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create sale: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Sale created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create sale.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create sale call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the sale creation server.'}`
    };
  }
}

export async function updateSale(token, saleId, updatedSaleData) {
  const SALE_UPDATE_URL = `${API_BASE_URL}/api/sale/${saleId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', SALE_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedSaleData, null, 2));

  try {
    const getResult = await getSaleById(token, saleId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing sale for update: ${getResult.message}` };
    }
    const existingSale = getResult.data;

    const finalUpdatePayload = {
      ...existingSale,
      ...updatedSaleData,
      id: saleId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(SALE_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Sale updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Sale Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Sale updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Sale updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update sale. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update sale call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the sale update server.'}`
    };
  }
}

export async function deleteSale(token, saleId) {
  const SALE_DELETE_URL = `${API_BASE_URL}/api/sale/${saleId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SALE_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Sale deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Sale Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Sale deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Sale deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete sale. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete sale call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the sale delete server.'}`
    };
  }
}
export async function getVendors(token) {
  const VENDORS_API_URL = `${API_BASE_URL}/api/vendor`;
  console.log('API: Fetching vendors with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(VENDORS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse vendors data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch vendors: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch vendors. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during vendors call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the vendors server.'}`
    };
  }
}

export async function getVendorById(token, vendorId) {
  const VENDOR_BY_ID_API_URL = `${API_BASE_URL}/api/vendor/${vendorId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!vendorId) {
    return { success: false, message: "No vendor ID provided." };
  }

  try {
    const response = await fetch(VENDOR_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse vendor data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch vendor: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch vendor with ID ${vendorId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get vendor by ID (${vendorId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the vendor server.'}` };
  }
}

export async function createVendor(authToken, vendorData) {
  const VENDORS_API_URL = `${API_BASE_URL}/api/vendor`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(VENDORS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(vendorData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Vendor created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Vendor Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create vendor: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Vendor created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create vendor.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create vendor call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the vendor creation server.'}`
    };
  }
}

export async function updateVendor(token, vendorId, updatedVendorData) {
  const VENDOR_UPDATE_URL = `${API_BASE_URL}/api/vendor/${vendorId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', VENDOR_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedVendorData, null, 2));

  try {
    const getResult = await getVendorById(token, vendorId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing vendor for update: ${getResult.message}` };
    }
    const existingVendor = getResult.data;

    const finalUpdatePayload = {
      ...existingVendor,
      ...updatedVendorData,
      id: vendorId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(VENDOR_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Vendor updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Vendor Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Vendor updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Vendor updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update vendor. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update vendor call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the vendor update server.'}`
    };
  }
}

export async function deleteVendor(token, vendorId) {
  const VENDOR_DELETE_URL = `${API_BASE_URL}/api/vendor/${vendorId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(VENDOR_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Vendor deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Vendor Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Vendor deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Vendor deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete vendor. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete vendor call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the vendor delete server.'}`
    };
  }
}
export async function getSupportCases(token) {
  const SUPPORT_CASES_API_URL = `${API_BASE_URL}/api/supportcase`;
  console.log('API: Fetching support cases with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SUPPORT_CASES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse support cases data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch support cases: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch support cases. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during support cases call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the support cases server.'}`
    };
  }
}

export async function getSupportCaseById(token, supportCaseId) {
  const SUPPORT_CASE_BY_ID_API_URL = `${API_BASE_URL}/api/supportcase/${supportCaseId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!supportCaseId) {
    return { success: false, message: "No support case ID provided." };
  }

  try {
    const response = await fetch(SUPPORT_CASE_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse support case data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch support case: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch support case with ID ${supportCaseId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get support case by ID (${supportCaseId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the support case server.'}` };
  }
}

export async function createSupportCase(authToken, supportCaseData) {
  const SUPPORT_CASES_API_URL = `${API_BASE_URL}/api/supportcase`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SUPPORT_CASES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(supportCaseData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Support case created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Support Case Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create support case: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Support case created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create support case.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create support case call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the support case creation server.'}`
    };
  }
}

export async function updateSupportCase(token, supportCaseId, updatedSupportCaseData) {
  const SUPPORT_CASE_UPDATE_URL = `${API_BASE_URL}/api/supportcase/${supportCaseId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', SUPPORT_CASE_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedSupportCaseData, null, 2));

  try {
    const getResult = await getSupportCaseById(token, supportCaseId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing support case for update: ${getResult.message}` };
    }
    const existingSupportCase = getResult.data;

    const finalUpdatePayload = {
      ...existingSupportCase,
      ...updatedSupportCaseData,
      id: supportCaseId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(SUPPORT_CASE_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Support case updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Support Case Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Support case updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Support case updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update support case. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update support case call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the support case update server.'}`
    };
  }
}

export async function deleteSupportCase(token, supportCaseId) {
  const SUPPORT_CASE_DELETE_URL = `${API_BASE_URL}/api/supportcase/${supportCaseId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(SUPPORT_CASE_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Support case deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Support Case Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Support case deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Support case deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete support case. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete support case call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the support case delete server.'}`
    };
  }
}
export async function getTodoTasks(token) {
  const TODO_TASKS_API_URL = `${API_BASE_URL}/api/todotask`;
  console.log('API: Fetching todo tasks with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(TODO_TASKS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse todo tasks data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch todo tasks: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch todo tasks. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during todo tasks call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the todo tasks server.'}`
    };
  }
}

export async function getTodoTaskById(token, todoTaskId) {
  const TODO_TASK_BY_ID_API_URL = `${API_BASE_URL}/api/todotask/${todoTaskId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!todoTaskId) {
    return { success: false, message: "No todo task ID provided." };
  }

  try {
    const response = await fetch(TODO_TASK_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse todo task data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch todo task: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch todo task with ID ${todoTaskId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get todo task by ID (${todoTaskId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the todo task server.'}` };
  }
}

export async function createTodoTask(authToken, todoTaskData) {
  const TODO_TASKS_API_URL = `${API_BASE_URL}/api/todotask`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(TODO_TASKS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(todoTaskData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Todo task created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Todo Task Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create todo task: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Todo task created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create todo task.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create todo task call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the todo task creation server.'}`
    };
  }
}

export async function updateTodoTask(token, todoTaskId, updatedTodoTaskData) {
  const TODO_TASK_UPDATE_URL = `${API_BASE_URL}/api/todotask/${todoTaskId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', TODO_TASK_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedTodoTaskData, null, 2));

  try {
    const getResult = await getTodoTaskById(token, todoTaskId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing todo task for update: ${getResult.message}` };
    }
    const existingTodoTask = getResult.data;

    const finalUpdatePayload = {
      ...existingTodoTask,
      ...updatedTodoTaskData,
      id: todoTaskId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(TODO_TASK_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Todo task updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Todo Task Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Todo task updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Todo task updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update todo task. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update todo task call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the todo task update server.'}`
    };
  }
}

export async function deleteTodoTask(token, todoTaskId) {
  const TODO_TASK_DELETE_URL = `${API_BASE_URL}/api/todotask/${todoTaskId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(TODO_TASK_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Todo task deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Todo Task Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Todo task deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Todo task deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete todo task. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete todo task call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the todo task delete server.'}`
    };
  }
}
export async function getRewards(token) {
  const REWARDS_API_URL = `${API_BASE_URL}/api/reward`;
  console.log('API: Fetching rewards with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(REWARDS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse rewards data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch rewards: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch rewards. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during rewards call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the rewards server.'}`
    };
  }
}

export async function getRewardById(token, rewardId) {
  const REWARD_BY_ID_API_URL = `${API_BASE_URL}/api/reward/${rewardId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!rewardId) {
    return { success: false, message: "No reward ID provided." };
  }

  try {
    const response = await fetch(REWARD_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse reward data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch reward: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch reward with ID ${rewardId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get reward by ID (${rewardId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the reward server.'}` };
  }
}

export async function createReward(authToken, rewardData) {
  const REWARDS_API_URL = `${API_BASE_URL}/api/reward`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(REWARDS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(rewardData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Reward created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Reward Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create reward: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Reward created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create reward.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create reward call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the reward creation server.'}`
    };
  }
}

export async function updateReward(token, rewardId, updatedRewardData) {
  const REWARD_UPDATE_URL = `${API_BASE_URL}/api/reward/${rewardId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', REWARD_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedRewardData, null, 2));

  try {
    const getResult = await getRewardById(token, rewardId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing reward for update: ${getResult.message}` };
    }
    const existingReward = getResult.data;

    const finalUpdatePayload = {
      ...existingReward,
      ...updatedRewardData,
      id: rewardId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(REWARD_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Reward updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Reward Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Reward updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Reward updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update reward. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update reward call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the reward update server.'}`
    };
  }
}

export async function deleteReward(token, rewardId) {
  const REWARD_DELETE_URL = `${API_BASE_URL}/api/reward/${rewardId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(REWARD_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Reward deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Reward Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Reward deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Reward deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete reward. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete reward call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the reward delete server.'}`
    };
  }
}
