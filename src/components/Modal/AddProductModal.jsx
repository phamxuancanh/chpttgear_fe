import { use, useCallback, useEffect, useState } from "react";
import { FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import { MdWarehouse } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { getAllInventory, findAllCategory, findAllSpecification, createProduct, createSpecification } from "../../routers/ApiRoutes";
import { useDropzone } from "react-dropzone";
import { ClockLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";

export default function AddProductModal({ setShowProductModal, length, productId }) {

  const updateProductId = productId;
  const productLength = length;
  const [name, setName] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState(0);
  const [guaranteePeriod, setGuaranteePeriod] = useState(0);
  const [images, setImages] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });
  const [specifications, setSpecifications] = useState([{ name: "", value: "" }]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [inventorys, setInventorys] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [categories, setCategories] = useState([]);
  const [specifications01, setSpecifications01] = useState([]);


  const productSpecs = {
    Headphones: [
      { key: "model", value: "Mẫu" },
      { key: "warranty", value: "Bảo hành" },
      { key: "type", value: "Kiểu" },
      { key: "connection", value: "Kết nối" },
      { key: "battery_life", value: "Thời lượng pin" },
      { key: "noise_cancellation", value: "Khử tiếng ồn chủ động" },
      { key: "microphone", value: "Microphone" },
      { key: "frequency_response", value: "Dải tần số" },
    ],
    Keyboards: [
      { key: "model", value: "Mẫu" },
      { key: "warranty", value: "Bảo hành" },
      { key: "switch_type", value: "Loại switch" },
      { key: "connection", value: "Kết nối" },
      { key: "backlight", value: "Đèn nền" },
      { key: "key_rollover", value: "Số lượng phím nhận diện cùng lúc" },
    ],
    Mice: [
      { key: "model", value: "Mẫu" },
      { key: "warranty", value: "Bảo hành" },
      { key: "sensor_type", value: "Loại cảm biến" },
      { key: "dpi", value: "Độ phân giải DPI" },
      { key: "connection", value: "Kết nối" },
      { key: "buttons", value: "Số nút" },
      { key: "battery_life", value: "Thời lượng pin" },
    ],
    RAM: [
      { key: "model", value: "Mẫu" },
      { key: "warranty", value: "Bảo hành" },
      { key: "capacity", value: "Dung lượng" },
      { key: "speed", value: "Tốc độ bus" },
      { key: "latency", value: "Độ trễ CAS" },
      { key: "voltage", value: "Điện áp" },
      { key: "type", value: "Loại RAM" },
    ],
    CPUs: [
      { key: "model", value: "Mẫu" },
      { key: "warranty", value: "Bảo hành" },
      { key: "cores", value: "Số nhân" },
      { key: "threads", value: "Số luồng" },
      { key: "base_clock", value: "Xung nhịp cơ bản" },
      { key: "boost_clock", value: "Xung nhịp tối đa" },
      { key: "socket", value: "Socket tương thích" },
      { key: "tdp", value: "Công suất tiêu thụ (TDP)" }
    ]
  };

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
  ]

  useEffect(() => {
    const fetchInvention = async () => {
      try {
        const res = await getAllInventory();
        setInventorys(res.data)
        console.log("Kho hàng");
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await findAllCategory();
        setCategories(response.data);
        console.log("Danh sách loại sản phẩm:");
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    const fetchSpecifications = async () => {
      try {
        const response = await findAllSpecification();
        setSpecifications01(response.data);
        console.log("Danh sách thông số kỹ thuật:");
      } catch (error) {
        console.error('Error fetching specifications:', error);
      }
    };
    fetchInvention();
    fetchCategories();
    fetchSpecifications();
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    setImages(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5242880
  });

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
    if (!selectedInventory) {
      alert("Kho hàng không được để trống");
      return false;
    }

    if (!name.trim()) {
      alert("Tên sản phẩm không được để trống");
      return false;
    }
  
    if (!brand.trim()) {
      alert("Nhà sản xuất không được để trống");
      return false;
    }
  
    if (!color) {
      alert("Màu sắc không được để trống");
      return false;
    }

    if (!size) {
      alert("Kích thước không được để trống");
      return false;
    } else {
      if (!isFinite(size) || Number(size) <= 0) {
        alert("Kích thước nhập số nguyên dương");
        return false;
      }
    }

    if (!weight) {
      alert("Trọng lượng không được để trống");
      return false;
    } else {
      if (!isFinite(weight) || Number(weight) <= 0) {
        alert("Trọng lượng  nhập số nguyên dương");
        return false;
      }
    }

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
    if (!price.trim()) {
      alert("Giá sản phẩm không được để trống");
      return false;
    } else {
      let purchasePrice = 10;
      let priceNumber = price.trim().replace(/\,/g, '');
      if (priceNumber <= (purchasePrice+purchasePrice*0.1)) {
        alert("Giá sản phẩm phải lớn hơn giá nhập");
        return false;
      }
      setPrice(Number(priceNumber));
    }

    if (!selectedCategory.id) {
      alert("Loại sản phẩm không được để trống");
      return false;
    }

    // if (!images.length) {
    //   alert("Hình ảnh không được để trống");
    //   return false;
    // }
  
      return true;
  };

  /** Kiểm tra giá trị nhập specification */
  const validateSpecification = () => {
    if (!selectedCategory.id) {
      alert("Loại sản phẩm không được để trống");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit")
    if (validateProduct()) {
      try {
        const category = categories.find((category) => category.id === selectedCategory.id);
        const newProduct = {
          name,
          description,
          price,
          brand,
          images,
          color,
          size,
          weight,
          guaranteePeriod,
          category,
          inventoryId: selectedInventory?.inventory_id,
          modifiedDate: new Date().toISOString()
        };
        const responseProduct = await createProduct(newProduct);
        if (responseProduct.status === 201) {
          specifications.map(async (spec) => {
            const responseSpecification = await createSpecification({
              product: responseProduct.data, 
              name: spec.name, 
              value: spec.value});
            if (responseSpecification.status === 201) {
              console.log("Thêm thông số kỹ thuật thành công");
            }
          });
        };
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
      }
      handleReset()
    };
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setBrand("");
    setImages([])
    setColor("#000000");
    setSize("");
    setWeight("");
    setGuaranteePeriod("");
    setSelectedCategory({ id: "", name: "" });
    setSpecifications([{ name: "", value: "" }]);
    setShowProductModal(false)
  };

  const handleCategoryChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedId = e.target.value;
    const selectedName = e.target.options[selectedIndex].text;

    setSelectedCategory({ id: selectedId, name: selectedName });
    setSelectedSpec(""); // Reset thông số khi đổi loại sản phẩm
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
            onClick={() => setShowProductModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="w-full mx-auto max-h-[65vh] overflow-y-auto">
          <div className="space-y-8 divide-y divide-gray-200 w-full">
            <div className="space-y-6">
              <div className="w-full ">
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">Kho</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        {selectedInventory ? (
                          <>
                            <MdWarehouse className="mr-2 text-blue-600" />
                            Tên kho: {selectedInventory.name} - Địa chỉ: {selectedInventory.address}
                          </>
                        ) : (
                          "Chọn kho"
                        )}
                      </span>
                      <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="absolute w-full mt-1 max-h-48 overflow-y-auto bg-white border rounded-lg shadow-lg z-10">
                        {inventorys.map((inventory) => (
                          <button
                            key={inventory.inventory_id}
                            className={`w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center ${selectedInventory?.inventory_id === inventory.inventory_id ? "bg-blue-100" : ""
                              }`}
                            onClick={() => {
                              setSelectedInventory(inventory);
                              setIsOpen(false);
                            }}
                          >
                            <MdWarehouse className="mr-2 text-blue-600" />
                            Tên kho: {inventory.name} - Địa chỉ: {inventory.address}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-3 border   rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Nhà sản xuất</label>

                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />


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
                  <label className="block text-sm font-medium text-gray-700">Kích thước (D x R)</label>

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
                      type="text"
                      value={price}
                      onChange={handlePriceChange}
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
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={file.preview}
                          alt={`preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
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
                        {selectedCategory && productSpecs[selectedCategory.name] && (
                          <>
                            <select
                              className="flex-1 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={spec.name}
                              onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}

                            >
                              <option value="" disabled>Chọn loại thông số</option>
                              {productSpecs[selectedCategory.name].map((spec1, index) => (
                                <option key={index} value={spec1.key}

                                >
                                  {spec1.value}
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
