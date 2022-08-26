import React, { useState } from "react";
import Navbar from "./frequent/Navbar";

interface Props {
  setActivateBtn: React.Dispatch<React.SetStateAction<boolean>>;
  ActivateBtn: boolean;
  setData: React.Dispatch<React.SetStateAction<Dataset>>;
  Data: Dataset;
}

interface PropsModal {
  Modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<Dataset>>;
}

interface Dataset {
  destination: string;
  custom: boolean;
  keyword: string;
  secure: boolean;
  password: string;
  login: boolean;
  userid: string;
  track: boolean;
}

const Header = (): JSX.Element => {
  const [ActivateBtn, setActivateBtn] = useState<boolean>(false);
  const [Data, setData] = useState<Dataset>({
    destination: "",
    custom: false,
    keyword: "",
    secure: false,
    password: "",
    login: false,
    userid: "",
    track: false,
  });

  return (
    <div className="bg-[#615efd] pb-10">
      <Navbar />
      <form
        id="minifyreq"
        className="system w-full m-auto max-w-5xl px-10 space-y-12 my-10 mt-20 relative"
      >
        <Urlinput
          setActivateBtn={setActivateBtn}
          ActivateBtn={ActivateBtn}
          setData={setData}
          Data={Data}
        />
        <Minifyoptions
          setActivateBtn={setActivateBtn}
          ActivateBtn={ActivateBtn}
          setData={setData}
          Data={Data}
        />
      </form>
    </div>
  );
};

export default Header;

const Urlinput = (props: Props): JSX.Element => {
  let { setActivateBtn, ActivateBtn, setData, Data } = props;
  const [ValidURL, setValidURL] = useState<boolean>(true);
  const [MinifiedURL, setMinifiedURL] = useState<boolean>(false);

  const request_minified_url = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    fetch(`http://localhost:4000/url/short`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(Data),
    })
      .then(async (response) => {
        const result = await response.json();
        if (result.request === "successfull") {
          setActivateBtn(false);
          const minifyreq = document.getElementById(
            "minifyreq"
          ) as HTMLFormElement | null;
          minifyreq!.reset();
          setMinifiedURL(true);
          const minifiedurl = "http://localhost:4000/" + result.keyword;
          const url_input = document.getElementById(
            "destination"
          ) as HTMLInputElement | null;
          url_input!.value = minifiedurl;
        } else if (result.request === "failed") {
          alert(result.message);
          const check = document.getElementById("modal") as HTMLInputElement;
          check.click();
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const copy_minified_url = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const url_input = document.getElementById(
      "destination"
    ) as HTMLInputElement | null;

    const target = e.target as HTMLElement;

    navigator.clipboard.writeText(url_input!.value).then(() => {
      target.innerHTML = "copied!";
      setTimeout(() => {
        target.innerHTML = "copy";
      }, 400);
    });
  };

  const resetAll = () => {
    setActivateBtn(false);
    setValidURL(true);
    setMinifiedURL(false);
    setData({
      destination: "",
      custom: false,
      keyword: "",
      secure: false,
      password: "",
      login: false,
      userid: "",
      track: false,
    });
    const minifyreq = document.getElementById(
      "minifyreq"
    ) as HTMLFormElement | null;
    minifyreq!.reset();
  };

  const paste = async (
    e: React.FocusEvent<HTMLInputElement, Element>
  ): Promise<void> => {
    try {
      const text: string = await navigator.clipboard.readText();
      e.target.value = text;
      checkinputval(e);
    } catch (err) {}
  };

  const checkinputval = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const val: string = e.target.value;
    console.log(val);

    if (val !== "") {
      const validurl: boolean = new RegExp(
        /^(((https|http):\/{2})([a-z0-9\-\.]{2,33})\.([a-z0-9]{2,33}))([a-zA-Z0-9\/\-\.\+\=\&\#\?\%\_\\\$\:\;\,\<\>]{0,})?/g
      ).test(val);
      if (validurl) {
        setValidURL(true);
        setActivateBtn(true);
        setData((value): Dataset => {
          return { ...value, [e.target.name]: val };
        });
      } else {
        setValidURL(false);
        setActivateBtn(false);
      }
      console.log(validurl);
    } else {
      setValidURL(true);
      setActivateBtn(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white/25 border-4 border-dashed border-white shadow-[0px_11px_20px_0px_rgba(43,36,128,0.41)] rounded-full flex flex-row justify-between items-center p-2.5  before:w-full  before:text-xl before:text-red-400 before:absolute before:-top-9 before:capitalize before:z-50 ${
          ValidURL ? "" : "before:content-['It_is_not_a_valid_URL_⚠️']"
        }`}
      >
        <input
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
            !MinifiedURL ? checkinputval(e) : "";
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement, Element>): void => {
            !MinifiedURL ? paste(e) : "";
          }}
          className="text-white text-lg px-3 mr-2 font-semibold w-full bg-transparent rounded-full outline-none border-none placeholder:text-slate-300 tracking-wider"
          type="text"
          name="destination"
          id="destination"
          placeholder="https://example.com/*"
        />
        {!MinifiedURL && (
          <button
            onClick={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void => {
              e.preventDefault();
              ActivateBtn ? request_minified_url(e) : "";
            }}
            className={`minifybtn font-semibold text-base capitalize px-10 py-1  ${
              ActivateBtn
                ? "bg-white text-black hover:scale-105 active:scale-90"
                : "bg-gray-300 text-gray-600"
            } rounded-full cursor-pointer  transition-all ease-in-out duration-200 `}
          >
            minify
          </button>
        )}
        {MinifiedURL && (
          <div className="flex flex-row space-x-5">
            <button
              onClick={(
                e: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void => {
                e.preventDefault();
                resetAll();
              }}
              className={`minifybtn font-semibold text-base capitalize px-10 py-1 bg-white text-black hover:scale-105 active:scale-90
               rounded-full cursor-pointer  transition-all ease-in-out duration-200 `}
            >
              clear
            </button>

            <button
              onClick={(
                e: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ): void => {
                e.preventDefault();
                copy_minified_url(e);
              }}
              className={`minifybtn font-normal w-max text-base capitalize px-10 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-full cursor-pointer hover:scale-105 active:scale-90 transition-all ease-in-out duration-200 `}
            >
              copy
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const Minifyoptions = (props: Props): JSX.Element => {
  let { ActivateBtn, setData } = props;

  const [Modal, setModal] = useState<boolean>(false);

  return (
    <div className="flex flex-row justify-evenly items-center">
      {ActivateBtn && (
        <input
          onChange={() => setModal(true)}
          className="hidden"
          type="checkbox"
          name="modal"
          id="modal"
        />
      )}
      {ActivateBtn && (
        <Form Modal={Modal} setModal={setModal} setData={setData} />
      )}
      <label
        htmlFor="modal"
        className={`trackurl flex flex-row justify-between items-center space-x-3 cursor-pointer before:opacity-0 before:invisible hover:before:visible hover:before:opacity-100 ${
          ActivateBtn
            ? "before:content-['Active'] "
            : "before:content-['Inactive'] "
        } before:w-fit before:px-5 before:py-1 before:absolute before:-bottom-12 before:bg-gray-700 before:text-gray-200 before:rounded-xl before:transition-all before:ease-in-out before:duration-300`}
      >
        <div className="icon">
          <svg
            className="w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M256-.0078C260.7-.0081 265.2 1.008 269.4 2.913L457.7 82.79C479.7 92.12 496.2 113.8 496 139.1C495.5 239.2 454.7 420.7 282.4 503.2C265.7 511.1 246.3 511.1 229.6 503.2C57.25 420.7 16.49 239.2 15.1 139.1C15.87 113.8 32.32 92.12 54.3 82.79L242.7 2.913C246.8 1.008 251.4-.0081 256-.0078V-.0078zM256 444.8C393.1 378 431.1 230.1 432 141.4L256 66.77L256 444.8z"
              fill={`${ActivateBtn ? "white" : "rgb(209 213 219)"}`}
            />
          </svg>
        </div>
        <p className={`${ActivateBtn ? "text-white" : "text-gray-300"}`}>
          Add Password
        </p>
      </label>
      <label
        htmlFor="modal"
        className={`trackurl flex flex-row justify-between items-center space-x-3 cursor-pointer before:opacity-0 before:invisible hover:before:visible hover:before:opacity-100 ${
          ActivateBtn
            ? "before:content-['Active'] "
            : "before:content-['Inactive'] "
        } before:w-fit before:px-5 before:py-1 before:absolute before:-bottom-12 before:bg-gray-700 before:text-gray-200 before:rounded-xl before:transition-all before:ease-in-out before:duration-300`}
      >
        <div className="icon">
          <svg
            className="w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z"
              fill={`${ActivateBtn ? "white" : "rgb(209 213 219)"}`}
            />
          </svg>
        </div>
        <p className={`${ActivateBtn ? "text-white" : "text-gray-300"}`}>
          Use Custom Keyword
        </p>
      </label>
      <label
        htmlFor="modal"
        className={`trackurl flex flex-row justify-between items-center space-x-3 cursor-pointer before:opacity-0 before:invisible hover:before:visible hover:before:opacity-100 ${
          ActivateBtn
            ? "before:content-['Active'] "
            : "before:content-['Inactive'] "
        } before:w-fit before:px-5 before:py-1 before:absolute before:-bottom-12 before:bg-gray-700 before:text-gray-200 before:rounded-xl before:transition-all before:ease-in-out before:duration-300`}
      >
        <div className="icon">
          <svg
            className="w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M144 32C170.5 32 192 53.49 192 80V176C192 202.5 170.5 224 144 224H48C21.49 224 0 202.5 0 176V80C0 53.49 21.49 32 48 32H144zM128 96H64V160H128V96zM144 288C170.5 288 192 309.5 192 336V432C192 458.5 170.5 480 144 480H48C21.49 480 0 458.5 0 432V336C0 309.5 21.49 288 48 288H144zM128 352H64V416H128V352zM256 80C256 53.49 277.5 32 304 32H400C426.5 32 448 53.49 448 80V176C448 202.5 426.5 224 400 224H304C277.5 224 256 202.5 256 176V80zM320 160H384V96H320V160zM352 448H384V480H352V448zM448 480H416V448H448V480zM416 288H448V416H352V384H320V480H256V288H352V320H416V288z"
              fill={`${ActivateBtn ? "white" : "rgb(209 213 219)"}`}
            />
          </svg>
        </div>
        <p className={`${ActivateBtn ? "text-white" : "text-gray-300"}`}>
          Generate QR Code
        </p>
      </label>
      <label
        htmlFor="modal"
        className={`trackurl flex flex-row justify-between items-center space-x-3 cursor-pointer before:opacity-0 before:invisible hover:before:visible hover:before:opacity-100 ${
          ActivateBtn
            ? "before:content-['Active'] "
            : "before:content-['Inactive'] "
        } before:w-fit before:px-5 before:py-1 before:absolute before:-bottom-12 before:bg-gray-700 before:text-gray-200 before:rounded-xl before:transition-all before:ease-in-out before:duration-300`}
      >
        <div className="icon">
          <svg
            className="w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M176 256C176 211.8 211.8 176 256 176C300.2 176 336 211.8 336 256C336 300.2 300.2 336 256 336C211.8 336 176 300.2 176 256zM256 0C273.7 0 288 14.33 288 32V66.65C368.4 80.14 431.9 143.6 445.3 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H445.3C431.9 368.4 368.4 431.9 288 445.3V480C288 497.7 273.7 512 256 512C238.3 512 224 497.7 224 480V445.3C143.6 431.9 80.14 368.4 66.65 288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H66.65C80.14 143.6 143.6 80.14 224 66.65V32C224 14.33 238.3 0 256 0zM128 256C128 326.7 185.3 384 256 384C326.7 384 384 326.7 384 256C384 185.3 326.7 128 256 128C185.3 128 128 185.3 128 256z"
              fill={`${ActivateBtn ? "white" : "rgb(209 213 219)"}`}
            />
          </svg>
        </div>
        <p className={`${ActivateBtn ? "text-white" : "text-gray-300"}`}>
          Track URL Clicks
        </p>
      </label>
    </div>
  );
};

const Form = (props: PropsModal): JSX.Element => {
  let { Modal, setModal, setData } = props;
  const [Showpas, setShowpas] = useState<boolean>(false);
  const [Keyword, setKeyword] = useState<boolean>(false);

  const datachanged = (name: string, value: string | boolean): void => {
    setData((val): Dataset => {
      return { ...val, [name]: value };
    });

    switch (name) {
      case "keyword":
        if (value) {
          datachanged("custom", true);
        } else {
          datachanged("custom", false);
        }
        break;
      case "password":
        if (value) {
          datachanged("secure", true);
        } else {
          datachanged("secure", false);
        }
        break;
    }
  };

  const checkkeyword = (keyword: string) => {
    if (keyword.length >= 4) {
      fetch(`http://localhost:4000/url/avail/${keyword}`, {
        method: "GET",
      })
        .then(async (res) => {
          const result = await res.json();
          if (result.useable) {
            setKeyword(true);
            datachanged("keyword", keyword);
          } else {
            setKeyword(false);
            datachanged("keyword", "");
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      setKeyword(false);
      datachanged("keyword", "");
    }
  };

  const debounce = (fn: (keyword: string) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (word: string) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(word);
      }, delay);
    };
  };

  const smartfunc = debounce(checkkeyword, 300);

  return (
    <div
      className={`absolute top-0 w-max h-fit bg-white py-5 px-10 rounded-xl space-y-5 shadow-xl transition-all ease-in-out duration-300  ${
        Modal ? "scale-100" : "scale-0"
      }`}
    >
      <div className="flex flex-col space-y-2">
        <label className="px-4 py-2 " htmlFor="password">
          Add Password
        </label>
        <div
          onClick={() =>
            setShowpas((val: boolean): boolean => (!val ? true : false))
          }
          className={`w-full flex justify-end items-end px-4 cursor-pointer before:opacity-0 before:invisible hover:before:visible hover:before:opacity-100 ${
            Showpas
              ? "before:content-['Hide_Password'] "
              : "before:content-['Show_Password'] "
          } before:w-fit before:px-5 before:py-1 before:absolute before:mr-7 before:bg-gray-700 before:text-gray-200 before:rounded-xl before:transition-all before:ease-in-out before:duration-300`}
        >
          {!Showpas && (
            <svg
              className="w-5 absolute "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M279.6 160.4C282.4 160.1 285.2 160 288 160C341 160 384 202.1 384 256C384 309 341 352 288 352C234.1 352 192 309 192 256C192 253.2 192.1 250.4 192.4 247.6C201.7 252.1 212.5 256 224 256C259.3 256 288 227.3 288 192C288 180.5 284.1 169.7 279.6 160.4zM480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6V112.6zM288 112C208.5 112 144 176.5 144 256C144 335.5 208.5 400 288 400C367.5 400 432 335.5 432 256C432 176.5 367.5 112 288 112z" />
            </svg>
          )}
          {Showpas && (
            <svg
              className="w-5 absolute "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path d="M150.7 92.77C195 58.27 251.8 32 320 32C400.8 32 465.5 68.84 512.6 112.6C559.4 156 590.7 207.1 605.5 243.7C608.8 251.6 608.8 260.4 605.5 268.3C592.1 300.6 565.2 346.1 525.6 386.7L630.8 469.1C641.2 477.3 643.1 492.4 634.9 502.8C626.7 513.2 611.6 515.1 601.2 506.9L9.196 42.89C-1.236 34.71-3.065 19.63 5.112 9.196C13.29-1.236 28.37-3.065 38.81 5.112L150.7 92.77zM223.1 149.5L313.4 220.3C317.6 211.8 320 202.2 320 191.1C320 180.5 316.1 169.7 311.6 160.4C314.4 160.1 317.2 159.1 320 159.1C373 159.1 416 202.1 416 255.1C416 269.7 413.1 282.7 407.1 294.5L446.6 324.7C457.7 304.3 464 280.9 464 255.1C464 176.5 399.5 111.1 320 111.1C282.7 111.1 248.6 126.2 223.1 149.5zM320 480C239.2 480 174.5 443.2 127.4 399.4C80.62 355.1 49.34 304 34.46 268.3C31.18 260.4 31.18 251.6 34.46 243.7C44 220.8 60.29 191.2 83.09 161.5L177.4 235.8C176.5 242.4 176 249.1 176 255.1C176 335.5 240.5 400 320 400C338.7 400 356.6 396.4 373 389.9L446.2 447.5C409.9 467.1 367.8 480 320 480H320z" />
            </svg>
          )}
        </div>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            datachanged(e.target.name, e.target.value);
          }}
          className="w-full  border border-1 py-2 px-4 rounded-full text-lg font-normal text-gray-800 bg-blue-50 outline-none"
          type={!Showpas ? "password" : "text"}
          name="password"
          id="password"
          placeholder="Enter Your password"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="px-4 py-2" htmlFor="keyword">
          Add Custom Path
        </label>

        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            smartfunc(e.target.value);
          }}
          className="w-full  border border-1 py-2 px-4 rounded-full text-lg font-normal text-gray-800 bg-blue-50 outline-none select-all"
          type="text"
          name="keyword"
          id="keyword"
          placeholder="Enter Your Keyword"
        />
        {!Keyword && (
          <p className="text-rose-500 px-4">Keyword is unavailable 🚫</p>
        )}
        {Keyword && (
          <p className="text-green-500 px-4">Keyword is available ✅</p>
        )}
      </div>
      <div className="flex flex-row justify-evenly items-center space-x-10">
        <div className=" flex justify-center items-center">
          <input
            disabled
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              datachanged(e.target.name, e.target.checked);
              console.log(e.target.name, e.target.checked);
            }}
            className="w-4 h-4 focus:ring-purple-500 cursor-pointer"
            type="checkbox"
            name="qrcode"
            id="qrcode"
          />
          <label className="px-4 py-3 text-lg cursor-pointer" htmlFor="qrcode">
            Generate QR Code
          </label>
        </div>
        <div className=" flex justify-center items-center">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              datachanged(e.target.name, e.target.checked);
              console.log(e.target.name, e.target.checked);
            }}
            className="w-4 h-4 focus:ring-purple-500 cursor-pointer"
            type="checkbox"
            name="track"
            id="track"
          />
          <label className="px-4 py-3 text-lg cursor-pointer" htmlFor="track">
            Track URL Clicks
          </label>
        </div>
      </div>

      <div className="btngroup flex justify-end items-end">
        <button
          type="button"
          onClick={() => setModal(false)}
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          OK Thanks
        </button>
      </div>
    </div>
  );
};

const ErrorAlert = (): JSX.Element => {
  return <></>;
};

// Error Alert
