import { useCallback, useEffect, useState } from "react";
import { FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import { createContext } from "react";
import { toast } from "react-toastify";
import {
  findAllCategory, findSpecificationsByProductId, createProduct, createSpecification,
  findProductById, uploadImagesToCloudinary, updateProduct
} from "../../routers/ApiRoutes";
import { useDropzone } from "react-dropzone";
import { ClockLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";

export const ToastContext = createContext();

export default function AddProductModal({ setShowProductModal, product_id }) {

  const [updateProductId, setUpdateProductId] = useState(product_id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState(0);
  const [guaranteePeriod, setGuaranteePeriod] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesUpdate, setImagesUpdate] = useState([]);

  const [brandSelected, setBrandSelected] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });
  const [specifications, setSpecifications] = useState([{ name: "", value: "" }]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [inventorys, setInventorys] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAllowUpdate, setIsAllowUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [categories, setCategories] = useState([]);


  const productSpecs = [
    { key: "model", value: "Mẫu" },
    { key: "warranty", value: "Bảo hành" },
    { key: "type", value: "Kiểu" },
    { key: "connection", value: "Kết nối" },
    { key: "battery_life", value: "Thời lượng pin" },
    { key: "noise_cancellation", value: "Khử tiếng ồn chủ động" },
    { key: "microphone", value: "Microphone" },
    { key: "frequency_response", value: "Dải tần số" },

    // Bàn phím
    { key: "switch_type", value: "Loại switch" },
    { key: "backlight", value: "Đèn nền" },
    { key: "key_rollover", value: "Số lượng phím nhận diện cùng lúc" },
    { key: "layout", value: "Bố cục phím" },
    { key: "polling_rate", value: "Tần số quét" },

    // Chuột
    { key: "sensor_type", value: "Loại cảm biến" },
    { key: "dpi", value: "Độ phân giải DPI" },
    { key: "buttons", value: "Số nút" },
    { key: "response_time", value: "Thời gian phản hồi" },
    { key: "grip_style", value: "Kiểu cầm" },

    // RAM
    { key: "capacity", value: "Dung lượng" },
    { key: "speed", value: "Tốc độ bus" },
    { key: "latency", value: "Độ trễ CAS" },
    { key: "voltage", value: "Điện áp" },
    { key: "type", value: "Loại RAM" },
    { key: "cooling", value: "Hệ thống tản nhiệt" },

    // CPU
    { key: "cores", value: "Số nhân" },
    { key: "threads", value: "Số luồng" },
    { key: "base_clock", value: "Xung nhịp cơ bản" },
    { key: "boost_clock", value: "Xung nhịp tối đa" },
    { key: "socket", value: "Socket tương thích" },
    { key: "tdp", value: "Công suất tiêu thụ (TDP)" },
    { key: "integrated_graphics", value: "Đồ họa tích hợp" },

    // GPU
    { key: "gpu_model", value: "Mẫu GPU" },
    { key: "vram", value: "Dung lượng VRAM" },
    { key: "memory_type", value: "Loại bộ nhớ" },
    { key: "memory_bus", value: "Bus bộ nhớ" },
    { key: "core_clock", value: "Xung nhịp nhân" },
    { key: "boost_clock_gpu", value: "Xung nhịp tối đa" },
    { key: "power_consumption", value: "Công suất tiêu thụ" },

    // Ổ cứng (SSD/HDD)
    { key: "storage_capacity", value: "Dung lượng lưu trữ" },
    { key: "interface", value: "Chuẩn giao tiếp" },
    { key: "read_speed", value: "Tốc độ đọc" },
    { key: "write_speed", value: "Tốc độ ghi" },
    { key: "form_factor", value: "Kích thước" },

    // Nguồn (PSU)
    { key: "wattage", value: "Công suất" },
    { key: "efficiency_rating", value: "Chứng nhận hiệu suất" },
    { key: "modular", value: "Thiết kế dây nguồn" },
    { key: "fan_size", value: "Kích thước quạt" },

    // Bo mạch chủ (Motherboard)
    { key: "chipset", value: "Chipset" },
    { key: "form_factor_mb", value: "Kích thước bo mạch" },
    { key: "ram_slots", value: "Số khe RAM" },
    { key: "pci_slots", value: "Số khe PCIe" },
    { key: "m2_slots", value: "Số khe M.2" },
    { key: "sata_ports", value: "Số cổng SATA" },

    // Tản nhiệt
    { key: "cooling_type", value: "Loại tản nhiệt" },
    { key: "radiator_size", value: "Kích thước két nước" },
    { key: "fan_speed", value: "Tốc độ quạt" },
    { key: "noise_level", value: "Độ ồn" }
  ];


  const colors = [
    { key: "black", value: "Đen" },
    { key: "white", value: "Trắng" },
    { key: "red", value: "Đỏ" },
    { key: "blue", value: "Xanh" },
    { key: "green", value: "Xanh lá" },
    { key: "yellow", value: "Vàng" },
    { key: "purple", value: "Tím" },
    { key: "gray", value: "Xám" },
    { key: "brown", value: "Nâu" },
    { key: "pink", value: "Hồng" },
    { key: "orange", value: "Cam" }
  ];

  const brands = [
    { key: 'intel', value: 'Intel' },
    { key: 'corsair', value: 'Corsair' },
    { key: 'dell', value: 'Dell' },
    { key: 'razer', value: 'Razer' },
    { key: 'nvidia', value: 'NVIDIA' },
    { key: 'samsung', value: 'Samsung' },
    { key: 'logitech', value: 'Logitech' },
    { key: 'lg', value: 'LG' },
    { key: 'asus', value: 'ASUS' },
    { key: 'nzxt', value: 'NZXT' },
  ]

  useEffect(() => {
    fetchCategories();
    fetchUpdateProduct();
    fetchSpecificationsByProductId();
  }, [updateProductId]);

  const fetchCategories = async () => {
    try {
      const response = await findAllCategory();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchUpdateProduct = async () => {
    if (!updateProductId) {
      setIsAllowUpdate(false);
      return
    };
    try {
      const response = await findProductById(updateProductId);
      setName(response.data.name);
      setDescription(response.data.description);
      let displayPrice = String(response.data.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrice(displayPrice);
      setBrand(response.data.brand);
      setBrandSelected(response.data.brand);
      setSelectedColor(response.data.color);
      setColor(response.data.color);
      setSize(response.data.size);
      setWeight(response.data.weight);
      setGuaranteePeriod(response.data.guaranteePeriod);
      setSelectedCategory({ id: response.data.category.id, name: response.data.category.name });
      const images = response.data.image.includes(",")
        ? response.data.image.split(",")
        : [response.data.image];
      console.log(images)
      setImages(images);
      setIsAllowUpdate(true);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };
  const fetchSpecificationsByProductId = async () => {
    try {
      if (updateProductId) {
        const response = await findSpecificationsByProductId(updateProductId);
        console.log("Thông số kỹ thuật của product update:", response.data);
        setSpecifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching specifications:', error);
    }
  }
  const onDrop = useCallback(acceptedFiles => {
    if (updateProductId) {
      // Nếu đang cập nhật, thêm ảnh vào imagesUpdate
      setImagesUpdate(prev => [...prev, ...acceptedFiles]);
    } else {
      // Nếu đang thêm mới, thêm ảnh vào images
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  }, [updateProductId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5242880
  });

  const uploadImages = async (imageArray) => {
    if (!imageArray || imageArray.length === 0) return "";

    console.log("Uploading images:", imageArray);

    const uploadedImages = await Promise.all(
      imageArray.map(async (image) => {
        // Nếu ảnh là file mới, thực hiện upload
        if (typeof image === "object") {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "chptt_gear");
          data.append("cloud_name", "chaamz03");

          try {
            const response = await uploadImagesToCloudinary(data);
            const res = await response.json();
            console.log("Uploaded URL:", res.url);
            return res.url;
          } catch (error) {
            console.error("Upload failed:", error);
            return null;
          }
        }
        // Nếu ảnh là URL có sẵn (cũ), giữ nguyên
        return image;
      })
    );

    // Lọc bỏ ảnh null và tạo chuỗi ngăn cách bằng dấu ","
    const validImages = uploadedImages.filter((url) => url !== null);
    const imagesString = validImages.join(",");

    console.log("Final Images String:", imagesString);

    return imagesString;
  };


  const handleSpecificationChange = (index, field, value) => {
    setSpecifications((prev) =>
      prev.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    );
  };
  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { name: "", value: "" }]);
  };
  const removeSpecification = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  /** Kiểm tra giá trị nhập product */
  const validateProduct = () => {
    if (!name.trim()) {
      alert("Tên sản phẩm không được để trống");
      return false;
    };
    if (!brandSelected && !updateProductId) {
      alert("Nhà sản xuất không được để trống");
      return false;
    };
    if (!color) {
      alert("Màu sắc không được để trống");
      return false;
    };
    if (!size) {
      alert("Kích thước không được để trống");
      return false;
    } else {
      if (!size.match(/^[1-9]\d*(\.\d+)?x[1-9]\d*(\.\d+)?x[1-9]\d*(\.\d+)?$/)) {
        alert("Kích thước nhập số dương theo định dạng D x R x C");
        return false;
      }
    };
    if (!weight) {
      alert("Trọng lượng không được để trống");
      return false;
    } else {
      if (!isFinite(weight) || Number(weight) <= 0) {
        alert("Trọng lượng  nhập số nguyên dương");
        return false;
      }
    };
    if (!guaranteePeriod) {
      alert("Thời gian bảo hành không được để trống");
      return false;
    } else {
      if (!isFinite(guaranteePeriod)) {
        alert("Thời gian bảo hành nhập số");
        return false;
      }
      if (guaranteePeriod <= 0 || guaranteePeriod > 36) {
        alert("Thời gian bảo hành là từ 1 đến 36 tháng");
        return false;
      }
    }
    if (!selectedCategory.id) {
      alert("Loại sản phẩm không được để trống");
      return false;
    }
    return true;
  };
  /** Kiểm tra giá trị nhập specification */
  const validateSpecification = () => {
    console.log(specifications.length)
    if (specifications.length <= 1) {
      return false;
    }
    if (specifications.length > 0) {
      console.log(specifications);
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit")
    if (validateProduct()) {

      if (updateProductId) {
        const imgString = await uploadImages(imagesUpdate);
        handlerUpdateProduct(imgString);
      } else {
        const imgString = await uploadImages(images);
        handlerCreateProduct(imgString);
      }
      handleReset();
    };
  };

  const handlerCreateProduct = async (imgString) => {
    try {
      const category = categories.find((category) => category.id === selectedCategory.id);
      const newProduct = {
        name,
        description,
        price: parseFloat(price.replace(/,/g, '')),
        brand: brandSelected,
        image: imgString,
        color,
        size,
        weight,
        guaranteePeriod,
        category,
        modifiedDate: new Date().toISOString()
      };
      const responseProduct = await createProduct(newProduct);
      console.log(responseProduct.status)
      console.log(validateSpecification())
      if (validateSpecification()) {
        if (responseProduct.status === 201) {
          specifications.forEach(async (spec) => {
            console.log(spec)
            const responseSpecification = await createSpecification({
              product: responseProduct.data,
              name: spec.name,
              value: spec.value
            });
            if (responseSpecification.status === 201) {
              console.log("Thêm thông số kỹ thuật thành công");
            }
          });
        };
      }
      toast.success("Thêm sản phẩm thành công")
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
    };
  };

  const handlerUpdateProduct = async (imgString) => {
    try {
      const category = categories.find((category) => category.id === selectedCategory.id);
      const updatedProduct = {
        name,
        description,
        price: parseFloat(price.replace(/,/g, '')),
        brand: brandSelected,
        image: images + "," + imgString,
        color,
        size,
        weight,
        guaranteePeriod,
        category,
        // inventoryId: selectedInventory?.inventory_id,
        modifiedDate: new Date().toISOString()
      };
      const responseProduct = await updateProduct(updateProductId, updatedProduct);
      if (validateSpecification()) {
        if (responseProduct.status === 200) {
          specifications.forEach(async (spec) => {
            const responseSpecification = await createSpecification({
              product: responseProduct.data,
              name: spec.name,
              value: spec.value
            });
            if (responseSpecification.status === 201) {
              console.log("Thêm thông số kỹ thuật thành công");
            }
          })
        };
      }
      toast.success("Cập nhật sản phẩm thành công")
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
    };
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setBrand({ key: "", value: "" });
    setImages([])
    setColor("#000000");
    setSize("");
    setWeight("");
    setGuaranteePeriod("");
    setBrandSelected({ key: "", value: "" });
    setSelectedCategory({ id: "", name: "" });
    setSpecifications([{ name: "", value: "" }]);
    console.log("Reset");
    setUpdateProductId("");
    setInventorys([]);
    setCategories([]);
    setShowProductModal({ show: false, productId: "" });
    setIsAllowUpdate(false);
  };

  const handleCategoryChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedId = e.target.value;
    const selectedName = e.target.options[selectedIndex].text;

    setSelectedCategory({ id: selectedId, name: selectedName });
    setSelectedSpec(""); // Reset thông số khi đổi loại sản phẩm
    console.log("Loại sản phẩm:", selectedName);
  };

  const handleBrandChange = (e) => {
    setBrandSelected(e.target.value);
    setBrand(e.target.value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    setColor(e.target.value);
    console.log("Màu sắc:", e.target.value);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Xóa tất cả ký tự không phải số
    if (value) {
      // Thêm dấu phẩy vào sau mỗi 3 chữ số
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    setPrice(value);
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-30">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
          <div className="flex justify-center items-center w-full h-140 mt-20">
            <ClockLoader
              className="flex justify-center items-center w-full mt-20"
              color="#5EEAD4"
              cssOverride={{
                display: 'block',
                margin: '0 auto',
                borderColor: 'blue'
              }}
              loading
              speedMultiplier={3}
              size={40}
            />
          </div>
        </div>
      )}
      <div className="min-h-[80vh] max-h-[80vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-10/12 ">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold leading-6 text-gray-900">Thông tin sản phẩm</h3>
          <button
            type="button"
            onClick={() => setShowProductModal({ show: false, productId: "" })}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="w-full mx-auto max-h-[65vh] overflow-y-auto">
          <div className="space-y-8 divide-y divide-gray-200 w-full">
            <div className="space-y-6">
              <div className="w-full ">

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <input
                    id="productName"
                    disabled={isAllowUpdate}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-3 border   rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                    Nhà sản xuất
                  </label>
                  <select
                    id="productBrand"
                    disabled={isAllowUpdate}
                    name="productBrand"
                    value={brandSelected}
                    onChange={handleBrandChange}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Chọn thương hiệu sản xuất"
                  >
                    <option value="" disabled>Chọn thương hiệu sản xuất</option>
                    {brands.map((brand) => (
                      <option key={brand.value} value={brand.key}>
                        {brand.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
                  <select
                    id="productColor"
                    name="productColor"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Select a product type"
                  >
                    <option value="" disabled>Chọn màu</option>
                    {colors.map((color) => (
                      <option key={color.key} value={color.key}>
                        {color.value}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Kích thước (D x R X C)</label>

                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />


                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Trọng lượng (gram)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />

                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Thời gian bảo hành (tháng)</label>
                  <input
                    type="number"
                    value={guaranteePeriod}
                    onChange={(e) => setGuaranteePeriod(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Giá bán</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">VND</span>
                    </div>
                    <input
                      id="productPrice"
                      disabled={isAllowUpdate}
                      type="text"
                      value={price}
                      onChange={(e) => handlePriceChange(e)}
                      className="mt-1 block w-full pl-16 p-3 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-3 block w-full shadow-sm border border-gray-300   rounded-md  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                    Loại sản phẩm
                  </label>
                  <select
                    id="productType"
                    disabled={isAllowUpdate}
                    name="productType"
                    value={selectedCategory.id}
                    onChange={handleCategoryChange}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Select a product type"
                  >
                    <option value="" disabled>Chọn loại sản phẩm</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">

                  <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                  <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <input {...getInputProps()} />
                        <p className="pl-1">
                          {isDragActive ? "Drop the files here..." : "Drag 'n' drop images here, or click to select files"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((file, index) => {
                      let imageUrl = typeof file === "object" ? URL.createObjectURL(file) : file;

                      return (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={imageUrl}
                            alt={`old preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                    {imagesUpdate.map((file, index) => {
                      let imageUrl1 = typeof file === "object" ? URL.createObjectURL(file) : file;

                      return (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={imageUrl1}
                            alt={`old preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Thông số kỹ thuật</h4>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Thêm thông số
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-4">
                        {selectedCategory && productSpecs.length > 0 && (
                          <>
                            <select
                              className="flex-1 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={spec.name}
                              onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}

                            >
                              <option value="" disabled>Chọn loại thông số</option>
                              {productSpecs.map((spec, index) => (
                                <option key={index} value={spec.key}>
                                  {spec.value}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              placeholder="Value"
                              value={spec.value}
                              onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                              className="flex-1 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeSpecification(index)}
                                className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end gap-3 mb-8">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleReset}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
