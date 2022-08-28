import React, { useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Script from "next/script";

interface datapass {
  security?: boolean;
  destination?: string;
  pathid?: string;
  refid: string;
  message?: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (context && context.params && context.params.pathid) {
    const pathID: { pathID: string | string[] } = {
      pathID: context.params.pathid,
    };
    let info: datapass | { refid: string; message: string };
    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/redirect/pathid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pathID),
        }
      );

      const data: datapass | { refid: string; message: string } =
        await response.json();

      info = { ...data };

      return {
        props: {
          ...info,
        },
        // revalidate: 10,
      };
    } catch (err) {
      console.log(err);
      info = { refid: "0", message: "next server error" };
      return {
        props: {
          ...info,
        },
        // revalidate: 10,
      };
    }
  }
  return {
    props: {
      refid: "0",
      message: "pathid is blank",
    },
    // revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const Redirectpath = (props: datapass): JSX.Element => {
  const [Input, setInput] = useState<string>("");
  const [Incorrect, setIncorrect] = useState<boolean>(false);
  const [WrongFormat, setWrongFormat] = useState<boolean>(false);

  let { security, destination, pathid, refid, message }: datapass = props;

  if (refid === "0") {
    return (
      <>
        <div className="w-full m-auto my-20 max-w-fit bg-gray-800 p-10 rounded-3xl border-4 border-gray-600 shadow-md">
          <svg
            className="max-w-52 min-w-20"
            viewBox="0 0 48 48"
            version="1"
            xmlns="http://www.w3.org/2000/svg"
            enableBackground="new 0 0 48 48"
          >
            <circle fill="#00ACC1" cx="17" cy="17" r="14" />
            <circle fill="#eee" cx="17" cy="17" r="11" />
            <rect x="16" y="8" width="2" height="9" />
            <rect
              x="18.2"
              y="16"
              transform="matrix(-.707 .707 -.707 -.707 46.834 19.399)"
              width="2.4"
              height="6.8"
            />
            <circle cx="17" cy="17" r="2" />
            <circle fill="#00ACC1" cx="17" cy="17" r="1" />
            <path
              fill="#FFC107"
              d="M11.9,42l14.4-24.1c0.8-1.3,2.7-1.3,3.4,0L44.1,42c0.8,1.3-0.2,3-1.7,3H13.6C12.1,45,11.1,43.3,11.9,42z"
            />
            <path
              fill="#263238"
              d="M26.4,39.9c0-0.2,0-0.4,0.1-0.6s0.2-0.3,0.3-0.5s0.3-0.2,0.5-0.3s0.4-0.1,0.6-0.1s0.5,0,0.7,0.1 s0.4,0.2,0.5,0.3s0.2,0.3,0.3,0.5s0.1,0.4,0.1,0.6s0,0.4-0.1,0.6s-0.2,0.3-0.3,0.5s-0.3,0.2-0.5,0.3s-0.4,0.1-0.7,0.1 s-0.5,0-0.6-0.1s-0.4-0.2-0.5-0.3s-0.2-0.3-0.3-0.5S26.4,40.1,26.4,39.9z M29.2,36.8h-2.3L26.5,27h3L29.2,36.8z"
            />
          </svg>

          <div className="expired text-3xl w-full text-center text-red-400 font-bold tracking-wider py-5">
            Link Expired
          </div>
        </div>
      </>
    );
  }

  const validatepassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();

    const inputdata: boolean = new RegExp(/[a-zA-Z0-9]{6,}/g).test(Input);

    if (inputdata) {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/redirect/protection`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            securecode: Input,
            pathid,
            refid,
          }),
        }
      );

      const data = await res.json();

      if (data.authentication === "successfull" && data.destination) {
        window.location.replace(data.destination);
      } else {
        setIncorrect(true);
      }
    } else {
      setWrongFormat(true);
    }
  };

  const dataInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputdata: boolean = new RegExp(/[a-zA-Z0-9]{6,}/g).test(
      e.target.value
    );
    if (inputdata) {
      setInput(e.target.value);
      setWrongFormat(false);
    } else {
      setWrongFormat(true);
    }
  };

  useEffect(() => {
    try {
      let canvas = document.createElement("canvas")  as HTMLCanvasElement;
      let webgl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      // console.log(webgl);
      if (webgl) {
        let debugInfo = webgl.getExtension("webgl_debug_renderer_info");
        var gpu = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      } else {
        var gpu = null;
      }

      try {
        var userAgentData = window.navigator.userAgentData;
      } catch (error) {
        var userAgentData = null;
      }

      const userdetails = {
        user_screen: {
          height: window.screen.height,
          width: window.screen.width,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth,
          orientation: {
            angle: window.screen.orientation.angle,
            type: window.screen.orientation.type,
          },
        },

        user_device: {
          os: userAgentData ? userAgentData.platform : null,
          platform: window.navigator.platform,
          mobile: userAgentData ? userAgentData.mobile : true,
          gpu_info: gpu,
          cpu_threads: window.navigator.hardwareConcurrency,
          maxTouchPoints: window.navigator.maxTouchPoints,
        },
        user_browser: {
          browser: userAgentData ? userAgentData.brands[2] : null,
          language: window.navigator.languages,
          user_agent: window.navigator.userAgent,
          appVersion: window.navigator.appVersion,
        },
        user_info: {},
        pathid: pathid,
        refid: refid,
      };

      // console.log(userdetails);

      const sendanalytics = async () => {
        const user = await fetch("http://ip-api.com/json", { method: "GET" });
        const user_info = await user.json();
        delete user_info.status;
        delete user_info.lat;
        delete user_info.lon;
        userdetails.user_info = user_info;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/redirect/data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userdetails),
          }
        );

        const finalres = await response.json();

        console.log(finalres);
        if (finalres.request && security === false) {
          window.location.replace("${destination}");
        }
        // return response;
      };

      sendanalytics();
    } catch (err) {
      console.log(err);
      window.location.replace("${destination}");
    }
  }, []);

  return (
    <>
      {security && (
        <div className="container mx-auto my-[calc(100vh/5)] flex w-full max-w-fit flex-col items-center justify-center space-y-3 ">
          <div className="secure w-40"></div>
          <span className="currenturl text-center text-sm font-normal">
            {`${process.env.NEXT_PUBLIC_UI_URL}/${pathid}`}
          </span>
          <span className="warning text-center text-lg font-semibold capitalize text-blue-500">
            This url is password protected 🔐
          </span>
          <form>
            <div className="pass relative flex flex-col items-center justify-center space-y-4">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dataInput(e);
                }}
                className="w-60 rounded-full py-2 px-5 text-center outline outline-1 outline-blue-500"
                type="password"
                name="pass"
                id="pass"
                required
                placeholder="Enter Password"
              />
              {Incorrect && (
                <span className="incorrect text-center capitalize text-red-500">
                 ⚠️ incorrect password, try again
                </span>
              )}
              {WrongFormat && (
                <span className="wrongpass  text-center capitalize text-red-500">
                 ⚠️ Password must be atleast
                  <br />6 characters long and contains
                  <br />
                  only alphabets and numbers
                </span>
              )}
              <button
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  validatepassword(e);
                }}
                id="loginform"
                type="button"
                className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

   
    </>
  );
};

export default Redirectpath;
